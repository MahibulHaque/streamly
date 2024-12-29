import { useEffect, useState } from 'react';
import { ClerkLoading, SignedIn, useUser } from '@clerk/clerk-react';
import Loader from '../Loader';
import { useMediaSources } from '@/hooks/useMediaSources';
import MediaConfiguration from '../MediaConfiguration';
import { ISubscription } from '@/interfaces/subscription.interface';
import { IStudio } from '@/interfaces/studio.interface';
import { IUser } from '@/interfaces/user.interface';
import { fetchUserProfile } from '@/api/user';







export interface IUserProfile {
	status: number;
	user: {
		subscription: ISubscription | null;
		studio: IStudio | null;
	} & IUser;
}

const Widget = () => {
	const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
	const { user } = useUser();
	const { state, fetchMediaResources } = useMediaSources();

	useEffect(() => {
		if (user?.id) {
			fetchUserProfile(user.id).then((p:IUserProfile) => {
				setUserProfile(p);
			});
			fetchMediaResources()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return (
		<div className="p-5">
			<ClerkLoading>
				<div className="flex items-center justify-center h-full">
					<Loader />
				</div>
			</ClerkLoading>
			<SignedIn>
				{userProfile ? (
					<MediaConfiguration state={state} user={userProfile.user}/>
				) : (
					<div className="flex justify-center w-full h-full">
						<Loader color="#fff" />
					</div>
				)}
			</SignedIn>
		</div>
	);
};

export default Widget;
