'use client';

import { getNotifications } from '@/actions/user';
import { getWorkspaces } from '@/actions/workspace';
import { MENU_ITEMS } from '@/constants/menu';
import { useQueryData } from '@/hooks/useQueryData';
import { WORKSPACES } from '@/store/slices/workspaces';
import { NotificationProps, WorkspaceProps } from '@/types';
import { Separator } from '@radix-ui/react-context-menu';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectItem,
} from '@radix-ui/react-select';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Modal from '../modal';
import { Menu, PlusCircle } from 'lucide-react';
import Search from '../search';
import SidebarItem from './sidebar-item';
import WorkspacePlaceholder from './workspace-placeholder';
import GlobalCard from '../card';
import PaymentButton from '../payment-button';
import InfoBar from '../infobar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

type Props = {
	activeWorkspaceId: string;
};

const Sidebar = ({ activeWorkspaceId }: Props) => {
	const router = useRouter();
	const pathName = usePathname();
	const dispatch = useDispatch();

	const { data, isFetched } = useQueryData(['user-workspaces'], getWorkspaces);
	const menuItems = MENU_ITEMS(activeWorkspaceId);

	const { data: notifications } = useQueryData(
		['user-notifications'],
		getNotifications,
	);

	const { data: workspace } = data as WorkspaceProps;
	const { data: count } = notifications as NotificationProps;

	const onChangeActiveWorkspace = (value: string) => {
		router.push(`/dashboard/${value}`);
	};

	const currentWorkspace = workspace?.workspace?.find(
		(s) => s.id === activeWorkspaceId,
	);

	if (isFetched && workspace) {
		console.log({ workspaces:workspace });
		dispatch(WORKSPACES({ workspaces: workspace.workspace }));
	}

	const SidebarSection = (
		<div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden">
			<div className="bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0 ">
				<Image
					src="/logo.svg"
					height={40}
					width={40}
					alt="logo"
				/>
				<p className="text-2xl">Streamly</p>
			</div>
			<Select
				defaultValue={activeWorkspaceId}
				onValueChange={onChangeActiveWorkspace}
			>
				<SelectTrigger className="mt-16 text-neutral-400 bg-transparent">
					<SelectValue placeholder="Select a workspace"></SelectValue>
				</SelectTrigger>
				<SelectContent className="bg-[#111111] backdrop-blur-xl">
					<SelectGroup>
						<SelectLabel>Workspaces</SelectLabel>
						<Separator />
						{workspace?.workspace?.map((workspace) => (
							<SelectItem
								value={workspace.id}
								key={workspace.id}
							>
								{workspace.name}
							</SelectItem>
						))}
						{workspace?.members?.length > 0 &&
							workspace?.members?.map(
								(workspace) =>
									workspace.WorkSpace && (
										<SelectItem
											value={workspace.WorkSpace.id}
											key={workspace.WorkSpace.id}
										>
											{workspace.WorkSpace.name}
										</SelectItem>
									),
							)}
					</SelectGroup>
				</SelectContent>
			</Select>
			{currentWorkspace?.type === 'PUBLIC' &&
				workspace.subscription?.plan == 'PRO' && (
					<Modal
						trigger={
							<span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90  hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
								<PlusCircle
									size={15}
									className="text-neutral-800/90 fill-neutral-500"
								/>
								<span className="text-neutral-400 font-semibold text-xs">
									Invite To Workspace
								</span>
							</span>
						}
						title="Invite To Workspace"
						description="Invite other users to your workspace"
					>
						<Search workspaceId={activeWorkspaceId} />
					</Modal>
				)}
			<p className="w-full text-[#9D9D9D] font-bold mt-4">Menu</p>
			<nav className="w-full">
				<ul>
					{menuItems.map((item) => (
						<SidebarItem
							href={item.href}
							icon={item.icon}
							selected={pathName === item.href}
							title={item.title}
							key={item.title}
							notifications={count?._count?.notification}
						/>
					))}
				</ul>
			</nav>
			<Separator className="w-4/5" />
			<p className="w-full text-[#9D9D9D] font-bold mt-4 ">Workspaces</p>

			{workspace?.workspace?.length === 1 &&
				workspace.members.length === 0 && (
					<div className="w-full mt-[-10px]">
						<p className="text-[#3c3c3c] font-medium text-sm">
							{workspace.subscription?.plan === 'FREE'
								? 'Upgrade to create workspaces'
								: 'No Workspaces'}
						</p>
					</div>
				)}

			<nav className="w-full">
				<ul className="h-[150px] overflow-auto overflow-x-hidden fade-layer">
					{workspace?.workspace?.length > 0 &&
						workspace.workspace.map(
							(item) =>
								item.type !== 'PERSONAL' && (
									<SidebarItem
										href={`/dashboard/${item.id}`}
										selected={pathName === `/dashboard/${item.id}`}
										title={item.name}
										key={item.name}
										icon={
											<WorkspacePlaceholder>
												{item.name.charAt(0)}
											</WorkspacePlaceholder>
										}
									/>
								),
						)}
					{workspace?.members?.length > 0 &&
						workspace.members.map((item) => (
							<SidebarItem
								href={`/dashboard/${item.WorkSpace.id}`}
								selected={
									pathName === `/dashboard/${item.WorkSpace.id}`
								}
								title={item.WorkSpace.name}
								key={item.WorkSpace.name}
								notifications={count?._count?.notification}
								icon={
									<WorkspacePlaceholder>
										{item.WorkSpace.name.charAt(0)}
									</WorkspacePlaceholder>
								}
							/>
						))}
				</ul>
			</nav>
			<Separator className="w-4/5" />
			{workspace.subscription?.plan === 'FREE' && (
				<GlobalCard
					title="Upgrade to Pro"
					description=" Unlock AI features like transcription, AI summary, and more."
					footer={<PaymentButton />}
				/>
			)}
		</div>
	);

	return (
		<div className="full">
			<InfoBar />
			<div className="md:hidden fixed my-4">
				<Sheet>
					<SheetTrigger
						asChild
						className="ml-2"
					>
						<Button
							variant={'ghost'}
							className="mt-[2px]"
						>
							<Menu />
						</Button>
					</SheetTrigger>
					<SheetContent
						side={'left'}
						className="p-0 w-fit h-full"
					>
						{SidebarSection}
					</SheetContent>
				</Sheet>
			</div>
			<div className="md:block hidden h-full">{SidebarSection}</div>
		</div>
	);
};

export default Sidebar;
