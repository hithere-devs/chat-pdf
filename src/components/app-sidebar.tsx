'use client';

import * as React from 'react';
import { Chat } from '@/lib/db/schema';
import {
	AudioWaveform,
	Blocks,
	Calendar,
	Command,
	Home,
	Inbox,
	MessageCircleQuestion,
	Search,
	Settings2,
	Sparkles,
	Trash2,
} from 'lucide-react';

import { NavFavorites } from '@/components/nav-favorites';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavWorkspaces } from '@/components/nav-workspaces';
import { NavUser } from '@/components/nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	chats: Chat[] | [];
	chatId: number;
}

export function AppSidebar({ chats, chatId, ...props }: AppSidebarProps) {
	// Nav Data
	const data = {
		user: {
			name: 'shadcn',
			email: 'm@example.com',
			avatar: '/avatars/shadcn.jpg',
		},
		navMain: [
			{
				title: 'Search',
				url: '#',
				icon: Search,
			},
			{
				title: 'Ask AI',
				url: '#',
				icon: Sparkles,
			},
			{
				title: 'Home',
				url: '#',
				icon: Home,
				isActive: true,
			},
		],
		navSecondary: [
			{
				title: 'Settings',
				url: '#',
				icon: Settings2,
			},
			{
				title: 'Trash',
				url: '#',
				icon: Trash2,
			},
			{
				title: 'Help',
				url: '#',
				icon: MessageCircleQuestion,
			},
		],
	};

	return (
		<Sidebar className='border-r-0' {...props}>
			<SidebarHeader>
				{/* <TeamSwitcher teams={data.teams} /> */}
				<NavUser user={data.user} />
				<NavMain items={data.navMain} />
			</SidebarHeader>
			<SidebarContent>
				<NavFavorites chats={chats} />
				{/* <NavWorkspaces workspaces={data.workspaces} /> */}
				<NavSecondary items={data.navSecondary} className='mt-auto' />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
