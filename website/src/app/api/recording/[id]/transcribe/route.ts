import { client } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const body = await req.json();

		const { id } = params;

		const content = JSON.parse(body.content);
		console.log({ Transcript: body.transcription });

		const transcribed = await client.video.update({
			where: {
				userId: id,
				source: body.filename,
			},
			data: {
				title: content.title,
				description: content.summary,
				summery: body.transcription,
			},
		});

		if (transcribed) {
			console.log('🟢 Transcribed');
			// const options = {
			// 	method: 'POST',
			// 	url: process.env.VOICEFLOW_KNOWLEDGE_BASE_API,
			// 	headers: {
			// 		accept: 'application/json',
			// 		'content-type': 'application/json',
			// 		Authorization: process.env.VOICEFLOW_API_KEY,
			// 	},
			// 	data: {
			// 		data: {
			// 			schema: {
			// 				searchableFields: ['title', 'transcript'],
			// 				metadataFields: ['title', 'transcript'],
			// 			},
			// 			name: content.title,
			// 			items: [
			// 				{
			// 					title: content.title,
			// 					transcript: body.transcript,
			// 				},
			// 			],
			// 		},
			// 	},
			// };

			// const updateKB = await axios.request(options);

			// if (updateKB.status === 200 || updateKB.status !== 200) {
			// 	console.log(updateKB.data);
			// }
			return NextResponse.json({ status: 200 });
		}
		return NextResponse.json({ status: 400 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ status: 500 });
	}
}
