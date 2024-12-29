import { useEffect } from 'react';
import { selectSources } from '@/lib/recorder';
import { ISources } from '@/interfaces/source';
import log from 'electron-log/renderer';


export const useVideoSources = (
	setOnSources: (sources: ISources | undefined) => void,
	videoElementRef: React.RefObject<HTMLVideoElement>,
	onSources?: ISources,
) => {
	window.ipcRenderer.on('profile-received', (_, payload) => {
		setOnSources(payload);
	});
	useEffect(() => {
		if (onSources?.screen) {
			selectSources(videoElementRef, onSources);
		}

		return () => {
			selectSources(videoElementRef);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onSources]);
};
