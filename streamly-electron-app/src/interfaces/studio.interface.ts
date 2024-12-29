export interface IStudio {
	id: string;
	screen: string | null;
	mic: string | null;
	preset: 'HD' | 'SD';
	camera: string | null;
	userId: string | null;
}
