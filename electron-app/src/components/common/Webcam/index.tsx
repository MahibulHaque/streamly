import { useEffect, useRef } from 'react';

const Webcam = () => {
	const camElement = useRef<HTMLVideoElement>(null);

	const streamWebCam = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});

		if (camElement.current) {
			camElement.current.srcObject = stream;
			await camElement.current.play();
		}
	};

	useEffect(() => {
		streamWebCam();
	}, []);

	return (
		<video
			ref={camElement}
			className="relative object-cover h-screen border-2 border-white rounded-full draggable aspect-video"
		></video>
	);
};

export default Webcam;
