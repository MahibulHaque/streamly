import { Button } from '@/components/ui/button';
import { SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import React from 'react';

const AuthButton = () => {
	return (
		<SignedOut>
			<div className="flex gap-x-3 h-screen items-center justify-center">
				<SignInButton>
					<Button
						variant={'outline'}
						className="px-10 rounded-full hover:bg-gray-200"
					>
						Sign In
					</Button>
				</SignInButton>
				<SignUpButton>
					<Button
						variant={'default'}
						className="px-10 rounded-full"
					>
						Sign Up
					</Button>
				</SignUpButton>
			</div>
		</SignedOut>
	);
};

export default AuthButton;