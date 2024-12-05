'use client';

import {
	ArrowUpRight,
	MessageCircle,
	MoreHorizontal,
	PlusIcon,
	StarOff,
	Trash2,
} from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';

import { Chat } from '@/lib/db/schema';
import Link from 'next/link';

export function NavFavorites({ chats }: { chats: Chat[] }) {
	const { isMobile } = useSidebar();

	return (
		<SidebarGroup className='group-data-[collapsible=icon]:hidden'>
			<SidebarGroupLabel>
				<span>Chats</span>
			</SidebarGroupLabel>
			<SidebarMenu>
				{chats.map((item) => (
					<SidebarMenuItem key={item.id}>
						<SidebarMenuButton asChild>
							<Link href={`/chat/${item.id}`} title={item.pdfName}>
								{/* <span>
									<MessageCircle />
								</span> */}
								<span>{item.pdfName.split('.pdf')[0]}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
