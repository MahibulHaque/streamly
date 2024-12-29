import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import fs from 'fs';
import { Server } from 'socket.io';
import { Readable } from 'stream';
import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import Groq from 'groq-sdk';

dotenv.config();

//@ts-ignore
const s3 = new S3Client({
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_KEY,
	},
	region: process.env.AWS_BUCKET_REGION,
	requestHandler: {
		requestTimeout: 60000,
	},
});

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

const app: Express = express();
const port = process.env.PORT ?? 5000;
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
	cors: {
		origin: process.env.ELECTRON_HOST,
		methods: ['GET', 'POST'],
	},
});

let recordedChunks: BlobPart[] = [];
const activeWriteStreams: Record<string, fs.WriteStream> = {};

io.on('connection', (socket) => {
	console.log('✔ Socket connection established');

	// Store active write streams to handle chunked uploads

	socket.on('video-chunks', async(data: { chunks: BlobPart; filename: string }) => {
		const filePath = `temp_upload/${data.filename}`;
		recordedChunks.push(data.chunks);

		const videoBlob = new Blob(recordedChunks, {
			type: 'video/webm; codecs=vp9',
		});

		const buffer = Buffer.from(await videoBlob.arrayBuffer());

		// If the write stream for the file doesn't exist, create it
		if (!activeWriteStreams[data.filename]) {
			activeWriteStreams[data.filename] = fs.createWriteStream(filePath);
		}

		// Write the chunk to the file

		const writeStream = activeWriteStreams[data.filename];
		writeStream.write(Buffer.from(buffer), (err) => {
			if (err) {
				console.error('🔥 Error writing chunk:', err);
			} else {
				console.log('✔ Chunk written successfully');
			}
		});
	});

	socket.on(
		'process-video',
		async (data: { filename: string; userId: string }) => {
			const filePath = `temp_upload/${data.filename}`;

			// Close the write stream if it exists
			if (activeWriteStreams[data.filename]) {
				activeWriteStreams[data.filename].end();
				delete activeWriteStreams[data.filename];
			}

			// Ensure the file exists and is not empty
			fs.stat(filePath, async (err, stats) => {
				if (err) {
					console.error('🔥 Error checking file:', err);
					return;
				}
				if (stats.size === 0) {
					console.error('🔥 Error: File is empty, cannot process.');
					return;
				}

				try {
					// Notify backend about processing start
					const processing = await axios.post(
						`${process.env.NEXT_API_HOST}/recording/${data.userId}/processing`,
						{ filename: data.filename },
					);

					if (processing.data.status !== 200) {
						throw new Error('Failed to create processing file');
					}

					// Upload the file to AWS S3
					const bucket = process.env.AWS_BUCKET_NAME;
					const contentType = 'video/webm';

					const command = new PutObjectCommand({
						Key: data.filename,
						Bucket: bucket,
						ContentType: contentType,
						Body: fs.createReadStream(filePath), // Use stream for efficient uploading
					});

					const fileStatus = await s3.send(command);

					if (fileStatus['$metadata'].httpStatusCode === 200) {
						console.log('✔ Video uploaded to AWS successfully.');

						// Additional processing for PRO users
						if (processing.data.plan === 'PRO' && stats.size < 25000000) {
							const transcription =
								await groq.audio.transcriptions.create({
									file: fs.createReadStream(filePath),
									model: 'whisper-large-v3',
									response_format: 'text',
								});
							console.log("🔥 This is the transcription generated for the video", {transcription})

							if (transcription) {
								const completion = await groq.chat.completions.create({
									response_format: { type: 'json_object' },
									model: 'llama3-70b-8192',
									messages: [
										{
											role: 'system',
											content: `You are going to generate a title and a nice description using speech to text transcription provided: transcription(${transcription}) and then return it in json format as {"title": <the title you gave>, "summary": <the summary you created>}`,
										},
									],
								});

								await axios.post(
									`${process.env.NEXT_API_HOST}/recording/${data.userId}/transcribe`,
									{
										filename: data.filename,
										content: completion.choices[0].message.content,
										transcription:transcription,
									},
								);
							}
						}

						// Notify backend about process completion
						await axios.post(
							`${process.env.NEXT_API_HOST}/recording/${data.userId}/complete`,
							{ filename: data.filename },
						);

						// Delete temporary file
						fs.unlink(filePath, (unlinkErr) => {
							if (unlinkErr) {
								console.error('🔥 Error deleting file:', unlinkErr);
							} else {
								console.log(`✔ ${data.filename} deleted successfully.`);
							}
						});
					} else {
						console.error('🔥 Error: Upload failed, process aborted.');
					}
				} catch (error) {
					console.error('🔥 Error processing video:', error);
				}
			});
		},
	);

	socket.on('disconnect', () => {
		console.log('✔ Socket.io is disconnected');
	});
});

server.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
