import React from 'react';
import { Spinner } from './spinner';
import { cn } from '@/lib/utils';

type Props = {
	state: boolean;
	className?: string;
	children?: React.ReactNode;
	color?: string;
};

const Loader = ({ state, className, children, color = '#000' }: Props) => {
	return state ? (
		<div className={cn(className)}>
			<Spinner color={color} />
		</div>
	) : (
		children
	);
};

export default Loader;
