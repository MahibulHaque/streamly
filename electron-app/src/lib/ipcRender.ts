export const onCloseApp = () => window.ipcRenderer.send('closeApp');

export const hidePluginWindow = (state: boolean) => {
    window.ipcRenderer.send('hide-plugin', { state });
};

export const resizeWindow = (shrink: boolean) => {
	window.ipcRenderer.send('resize-studio', { shrink });
};

export const getMediaResources = async () => {
	const displays = await window.ipcRenderer.invoke('getSources');
	const enumerateDevices =
		await window.navigator.mediaDevices.enumerateDevices();
	const audioInputs = enumerateDevices.filter(
		(device) => device.kind === 'audioinput',
	);
	return { displays, audio: audioInputs };
};
