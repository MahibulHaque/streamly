import { ISubscription } from '@/interfaces/subscription.interface';
import useZodForm from './useZodForm';
import { updateStudioSettingsSchema } from '@/schemas/studio-settings.schema';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { updateStudioSettings } from '@/api/user';

export interface IStudioSettingsProps extends Partial<ISubscription> {
	id: string;
	screen?: string | null;
	audio?: string | null;
	preset?: 'HD' | 'SD';
}

export const useStudioSettings = ({
	screen,
	audio,
	preset,
	plan,
	id,
}: IStudioSettingsProps) => {
	const [onPreset, setOnPreset] = useState<'HD' | 'SD' | undefined>();
	const { register, watch } = useZodForm(updateStudioSettingsSchema, {
		screen: screen,
		audio: audio!,
		preset: preset!,
	});

	const { mutate, isPending } = useMutation({
		mutationKey: ['update-studio'],
		mutationFn: (
			data: NonNullable<Omit<IStudioSettingsProps, 'subscription'>>,
		) => updateStudioSettings(data),
		onSuccess: (data) => {
			return toast(data.status === 200 ? 'Success' : 'Error', {
				description: data.message,
			});
		},
	});

	useEffect(() => {
		if (screen && audio) {

			window.ipcRenderer.send('media-sources', {
				screen,
				id: id,
				audio,
				preset,
				plan,
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [audio, screen]);

	useEffect(() => {
		const subscribe = watch((values) => {
			setOnPreset(values.preset);
			mutate({
				screen: values.screen!,
				audio: values.audio!,
				preset: values.preset!,
				id,
			});
			window.ipcRenderer.send('media-sources', {
				screen: values.screen,
				audio: values.audio,
				preset: values.preset,
				plan,
				id,
			});
		});
		return () => subscribe.unsubscribe();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch]);

	return { register, isPending, onPreset };
};
