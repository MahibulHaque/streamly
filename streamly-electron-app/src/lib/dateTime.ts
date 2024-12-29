export const videoRecordingTime = (ms: number) => {
	const second = Math.floor((ms / 1000) % 60)
		.toString()
		.padStart(2, '0');
	const minute = Math.floor((ms / (1000 * 60)) % 60)
		.toString()
		.padStart(2, '0');
	const hour = Math.floor(ms / (1000 * 60 * 60))
		.toString()
		.padStart(2, '0');

	return {
		length: `${hour}:${minute}:${second}`,
		minute: Math.floor((ms / (1000 * 60)) % 60), // Ensure `minute` is numeric
	};
};
