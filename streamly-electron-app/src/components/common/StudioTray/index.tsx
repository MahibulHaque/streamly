import { useState, useRef } from 'react';
import RecordingControls from './RecordingControls';
import { useRecordingTimer } from '@/hooks/useRecordingTimer';
import { useVideoSources } from '@/hooks/useVideoSources';
import { ISources } from '@/interfaces/source';
import { StartRecording, onStopRecording } from '@/lib/recorder';
import { cn } from '@/lib/utils';

const StudioTray = () => {
	const [preview, setPreview] = useState<boolean>(false);
	const [recording, setRecording] = useState<boolean>(false);
	const [onSources, setOnSources] = useState<ISources | undefined>();
	const videoElementRef = useRef<HTMLVideoElement | null>(null);

	useVideoSources(setOnSources, videoElementRef, onSources);
	const { onTimer, resetTimer } = useRecordingTimer(
		recording,
		() => {
			setRecording(false);
			resetTimer();
		},
		onSources,
	);

	const handleStartRecording = () => {
		if (onSources) {
			setRecording(true);
			StartRecording(onSources);
		}
	};

	const handleStopRecording = () => {
		setRecording(false);
		resetTimer();
		onStopRecording();
	};

	return (
		<div className="flex flex-col justify-end h-screen gap-y-5 draggable">
			{preview && (
				<video
					muted
					autoPlay
					ref={videoElementRef}
					className={cn('w-6/12 border-2 self-end bg-white')}
				/>
			)}
			<RecordingControls
				recording={recording}
				onTimer={onTimer}
				onStart={handleStartRecording}
				onStop={handleStopRecording}
				togglePreview={() => setPreview((prev) => !prev)}
			/>
		</div>
	);
};

export default StudioTray;
