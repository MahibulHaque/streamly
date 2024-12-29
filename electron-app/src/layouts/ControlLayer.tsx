import React, { useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { X } from 'lucide-react';
import { onCloseApp } from '@/lib/ipcRender';
import { cn } from '@/lib/utils';

type Props = {
	children: React.ReactNode;
	className?: string;
};

const ControlLayer = ({ children, className }: Props) => {
	const [isVisible, setIsVisible] = useState<boolean>(false);

	window.ipcRenderer.on('hide-plugin', (_, payload) => {
		setIsVisible(payload.state);
	});

	return (
		<div
			className={cn(
				className,
				isVisible && 'invisible',
				'bg-[#171717] flex flex-col rounded-xl overflow-hidden border-2 border-neutral-700',
			)}
		>
			<div className="flex items-center justify-between p-5 draggable">
				<span className="non-draggable">
					<UserButton />
				</span>
				<X
					size={20}
					className="text-gray-400 cursor-pointer non-draggable hover:text-white"
					onClick={onCloseApp}
				></X>
			</div>
			<div className="flex-1 h-0 overflow-auto">{children}</div>
			<div className="flex h-full p-5">
				<div className="flex items-center gap-x-2">
					<img
						src="/logo.svg"
						alt="logo"
					/>
					<p className="text-2xl text-white">streamly</p>
				</div>
			</div>
		</div>
	);
};

export default ControlLayer;
