import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const LandingPageNavBar = () => {
	return (
		<header className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-background">
			<div className="container mx-auto flex justify-between items-center">
				<Link
					href="/"
					className="text-2xl font-bold text-primary"
				>
					Streamly
				</Link>
				<nav className="hidden md:flex space-x-10">
					<Link
						href="#features"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Features
					</Link>
					<Link
						href="#pricing"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Pricing
					</Link>
					<Link
						href="#about"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						About
					</Link>
				</nav>
				<div className="flex items-center">
					<Link href="/auth/sign-in">
						<Button className="text-base flex gap-x-2">
							<User fill="#000" />
							Login
						</Button>
					</Link>
				</div>
			</div>
		</header>
	);
};

export default LandingPageNavBar;
