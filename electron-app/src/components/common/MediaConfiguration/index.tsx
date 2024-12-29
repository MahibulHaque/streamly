import { SourceDeviceStateProps } from '@/hooks/useMediaSources';
import { useStudioSettings } from '@/hooks/useStudioSettings';
import { IStudio } from '@/interfaces/studio.interface';
import { ISubscription } from '@/interfaces/subscription.interface';
import { IUser } from '@/interfaces/user.interface';
import Loader from '../Loader';
import {
	HeadphonesIcon,
	MonitorIcon,
	SettingsIcon,
} from 'lucide-react';

type Props = {
	state: SourceDeviceStateProps;
	user: {
		subscription: ISubscription | null;
		studio: IStudio | null;
	} & IUser;
};

const MediaConfiguration = ({ state, user }: Props) => {
	const activeScreen = state?.displays?.find(
		(screen) => screen.id === user?.studio?.screen,
	);

	const activeAudio = state?.audioInputs?.find(
		(audioInput) => audioInput.deviceId === user.studio?.mic,
	);

	const { register, isPending, onPreset } = useStudioSettings({
		id: user?.id,
		screen: user?.studio?.screen ?? state?.displays[0]?.id,
		audio: user?.studio?.mic ?? state?.audioInputs[0]?.deviceId,
		preset: user?.studio?.preset,
		plan: user?.subscription?.plan,
	});
	return (
		<form className="relative flex flex-col w-full h-full gap-y-5">
			{isPending && (
				<div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full rounded-2xl bg-black/80">
					<Loader />
				</div>
			)}
			<div className="flex items-center justify-center gap-x-5">
				<MonitorIcon
					fill="#575655"
					color="#575655"
					size={36}
				/>
				<select
					{...register('screen')}
					className="px-5 py-2 text-white border-2 outline-none cursor-pointer rounded-xl border-[#575655] bg-transparent w-full"
				>
					{state.displays.map((display) => (
						<option
							key={display.id}
							selected={activeScreen && activeScreen.id === display.id}
							value={display.id}
							className="bg-[#171717] cursor-pointer"
						>
							{display.name}
						</option>
					))}
				</select>
			</div>
			<div className="flex items-center justify-center gap-x-5">
				<HeadphonesIcon
					fill="#575655"
					color="#575655"
					size={36}
				/>
				<select
					{...register('audio')}
					className="px-5 py-2 text-white border-2 outline-none cursor-pointer rounded-xl border-[#575655] bg-transparent w-full"
				>
					{state.audioInputs.map((audio) => (
						<option
							key={audio.deviceId}
							selected={
								activeAudio && activeAudio.deviceId === audio.deviceId
							}
							value={audio.deviceId}
							className="bg-[#171717] cursor-pointer"
						>
							{audio.label}
						</option>
					))}
				</select>
			</div>
			<div className="flex items-center justify-center gap-x-5">
				<SettingsIcon
					fill="#575655"
					color="#575655"
					size={36}
				/>
				<select
					{...register('preset')}
					className="px-5 py-2 text-white border-2 outline-none cursor-pointer rounded-xl border-[#575655] bg-transparent w-full"
				>
					<option
						disabled={user.subscription?.plan === 'FREE'}
						selected={onPreset === 'HD' || user.studio?.preset === 'HD'}
						value={'HD'}
						className="bg-[#171717] cursor-pointer"
					>
						1080p{' '}
						{user.subscription?.plan === 'FREE' &&
							'(Upgrade to PRO plan)'}
					</option>
					<option
						selected={onPreset === 'SD' || user.studio?.preset === 'SD'}
						value={'SD'}
						className="bg-[#171717] cursor-pointer"
					>
						720p
					</option>
				</select>
			</div>
		</form>
	);
};

export default MediaConfiguration;
