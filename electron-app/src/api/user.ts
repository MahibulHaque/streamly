import { axiosInstance } from '@/config/axio';
import { IStudioSettingsProps } from '@/hooks/useStudioSettings';

export const fetchUserProfile = async (clerkId: string) => {
	const response = await axiosInstance.get(`/auth/${clerkId}`);

	return response.data;
};

export const updateStudioSettings = async ({
	id,
	screen,
	audio,
	preset,
}: NonNullable<Omit<IStudioSettingsProps, 'subscription'>>) => {
	const response = await axiosInstance.post(
		`/studio/${id}`,
		{ screen, audio, preset }
	);
	return response.data;
};
