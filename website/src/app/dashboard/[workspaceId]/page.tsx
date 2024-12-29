import React from 'react';
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query';
import { getAllUserVideos, getWorkspaceFolders } from '@/actions/workspace';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateWorkspace from '@/components/common/create-workspace';
import CreateFolders from '@/components/common/create-folders';
import Folders from '@/components/common/folders';

type Props = {
	params: {
		workspaceId: string;
	};
};

const Page = async ({ params: { workspaceId } }: Props) => {
	const query = new QueryClient();

	await query.prefetchQuery({
		queryKey: ['workspace-folders'],
		queryFn: () => getWorkspaceFolders(workspaceId),
	});

	await query.prefetchQuery({
		queryKey: ['user-videos'],
		queryFn: () => getAllUserVideos(workspaceId),
	});

	return (
		<HydrationBoundary state={dehydrate(query)}>
			<div>
				<Tabs
					defaultValue="videos"
					className="mt-6"
				>
					<div className="flex w-full justify-between items-center">
						<TabsList className="bg-transparent gap-2 pl-0">
							<TabsTrigger
								className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
								value="videos"
							>
								Videos
							</TabsTrigger>
							<TabsTrigger
								value="archive"
								className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
							>
								Archive
							</TabsTrigger>
						</TabsList>
						<div className="flex gap-x-3">
							<CreateWorkspace />
							<CreateFolders workspaceId={workspaceId} />
						</div>
					</div>
					<section className="py-9">
						<TabsContent value="videos">
							<Folders workspaceId={workspaceId} />
						</TabsContent>
					</section>
				</Tabs>
			</div>
		</HydrationBoundary>
	);
};

export default Page;
