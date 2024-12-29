import { cn } from '@/lib/utils';
import { Cast, Pause, Square } from 'lucide-react';

interface IRecordingControlsProps {
	recording: boolean;
	onTimer: string;
	onStart: () => void;
	onStop: () => void;
	togglePreview: () => void;
	// preview: boolean;
}

const RecordingControls = ({
	recording,
	onTimer,
	onStart,
	onStop,
	togglePreview,
}: IRecordingControlsProps) => (
	<div className="flex items-center justify-around w-full h-20 border-2 rounded-full bg-[#171717] border-white/40">
		<button
			onClick={onStart}
			className={cn(
				'non-draggable p-0 m-0 rounded-full cursor-pointer relative hover:opacity-80',
				recording
					? 'bg-red-500 w-6 h-6 min-w-6 min-h-6 max-w-6 max-h-6'
					: 'bg-red-400 w-8 h-8 min-w-8 min-h-8 max-w-8 max-h-8',
			)}
		>
			{recording && (
				<span className="absolute text-white transform -translate-y-1/2 -right-20 top-1/2">
					{onTimer}
				</span>
			)}
		</button>
		{!recording ? (
			<Pause
				className="opacity-50 non-draggable"
				size={32}
				fill="white"
				stroke="none"
			/>
		) : (
			<Square
				size={32}
				stroke="white"
				className="transition duration-150 transform cursor-pointer non-draggable hover:scale-110"
				onClick={onStop}
			/>
		)}
		<Cast
			size={32}
			onClick={togglePreview}
			fill="white"
			className="cursor-pointer non-draggable hover:opacity-60"
			stroke="white"
		/>
	</div>
);

export default RecordingControls;
