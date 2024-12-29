import { useState, useRef, useEffect } from 'react';
import { videoRecordingTime } from '@/lib/dateTime';
import { onStopRecording } from '@/lib/recorder';
import { ISources } from '@/interfaces/source';

export const useRecordingTimer = (
	recording: boolean,
	clearTime: () => void,
	onSources?: ISources,
) => {
	const [onTimer, setOnTimer] = useState<string>('00:00:00');
	const [elapsedTime, setElapsedTime] = useState<number>(0); // Tracks elapsed time in milliseconds
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!recording) {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
			return;
		}

		const startTime = Date.now() - elapsedTime; // Adjust start time if resuming
		timerRef.current = setInterval(() => {
			const time = Date.now() - startTime;
			setElapsedTime(time);

			const recordingTime = videoRecordingTime(time);

			if (onSources?.plan === 'FREE' && recordingTime.minute === 5) {
				clearTime();
				onStopRecording();
				if (timerRef.current) clearInterval(timerRef.current);
			}

			setOnTimer(recordingTime.length);
		}, 1000);

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [recording, elapsedTime, onSources, clearTime]);

	const resetTimer = () => {
		setElapsedTime(0);
		setOnTimer('00:00:00');
	};

	return { onTimer, resetTimer };
};
