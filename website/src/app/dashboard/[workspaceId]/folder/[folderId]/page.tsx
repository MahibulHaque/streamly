import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getAllUserVideos, getFolderInfo } from '@/actions/workspace';
import Videos from '@/components/common/videos';
import FolderInfo from '@/components/common/folders/folder-info';

type Props = {
	params: {
		folderId: string;
		workspaceId: string;
	};
};

const Page = async ({ params: { folderId, workspaceId } }: Props) => {
	const query = new QueryClient();
	await query.prefetchQuery({
		queryKey: ['folder-videos'],
		queryFn: () => getAllUserVideos(folderId),
	});

	await query.prefetchQuery({
		queryKey: ['folder-info'],
		queryFn: () => getFolderInfo(folderId),
	});
	return (
		<HydrationBoundary state={dehydrate(query)}>
			<FolderInfo folderId={folderId} />
			<Videos
				workspaceId={workspaceId}
				folderId={folderId}
				videosKey="folder-videos"
			/>
		</HydrationBoundary>
	);
};

export default Page;
