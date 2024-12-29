import { v4 as uuid } from 'uuid';
import { hidePluginWindow } from './ipcRender';
import { ISources } from '@/interfaces/source';
import log from 'electron-log/renderer';
import { onDataAvailable, stopRecording } from './socket';

let mediaRecorder: MediaRecorder;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let videoTransferFileName: string | undefined;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let userId: string | undefined;

export const StartRecording = (onSources: ISources) => {
	hidePluginWindow(true);
	videoTransferFileName = `${uuid()}-${onSources.id.slice(0, 8)}.webm`;
	mediaRecorder.start(1000);
};

export const onStopRecording = () => {
	mediaRecorder.stop();
};

export const selectSources = async (
	videoElement: React.RefObject<HTMLVideoElement>,
	onSources?: ISources,
) => {
	try {
		if (onSources?.screen && onSources.audio && onSources.id) {
			userId = onSources.id;

			log.info({userId})
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const constraints: any = {
				video: {
					mandatory: {
						chromeMediaSource: 'desktop',
						chromeMediaSourceId: onSources.screen,
						minWidth: onSources.preset === 'HD' ? 1920 : 1280,
						maxWidth: onSources.preset === 'HD' ? 1920 : 1280,
						minHeight: onSources.preset === 'HD' ? 1080 : 720,
						maxHeight: onSources.preset === 'HD' ? 1080 : 720,
						frameRate: 30,
					},
				},
				audio: false,
			};

			// Get video stream
			const videoStream = await navigator.mediaDevices.getUserMedia(
				constraints,
			);

			// Get audio stream if audio source is provided
			const audioStream = await navigator.mediaDevices.getUserMedia({
				video: false,
				audio: { deviceId: { exact: onSources.audio } },
			});

			// Combine video and audio streams
			const combinedStream = new MediaStream([
				...videoStream.getVideoTracks(),
				...audioStream.getAudioTracks(),
			]);

			// Assign the combined stream to the video element
			if (videoElement?.current) {
				videoElement.current.srcObject = combinedStream;
				await videoElement.current.play();
				log.info('Video element updated with new screen source.');
			}

			// Set up media recorder
			mediaRecorder = new MediaRecorder(combinedStream, {
				mimeType: 'video/webm; codecs=vp9',
			});

			mediaRecorder.ondataavailable = (e) => {
				onDataAvailable(e, videoTransferFileName ?? `${uuid()}`);
			};

			mediaRecorder.onstop = () => {
				stopRecording(videoTransferFileName ?? '', userId ?? '');
			};
		}
	} catch (error) {
		log.error('Error in selectSources:', error);
	}
};
