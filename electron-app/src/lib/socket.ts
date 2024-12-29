import io from 'socket.io-client';
import { hidePluginWindow } from './ipcRender';

const socket = io(import.meta.env.VITE_SOCKET_URL as string);


export const onDataAvailable = (
	e: BlobEvent,
	videoTransferFileName: string,
) => {
	socket.emit('video-chunks', {
		chunks: e.data,
		filename: videoTransferFileName,
	});
};

export const stopRecording = (
	videoTransferFileName: string,
	userId: string,
) => {
	hidePluginWindow(false);
	socket.emit('process-video', {
		filename: videoTransferFileName,
		userId,
	});
};
