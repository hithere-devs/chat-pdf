'use client';

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';

import { Chat } from '@/lib/db/schema';
import Link from 'next/link';

export function NavFavorites({
	chats,
	chatId,
}: {
	chats: Chat[];
	chatId: number;
}) {
	// const { isMobile } =
	useSidebar();

	return (
		<SidebarGroup className='group-data-[collapsible=icon]:hidden'>
			<SidebarGroupLabel>
				<span>Chats</span>
			</SidebarGroupLabel>
			<SidebarMenu>
				{chats.map((item) => (
					<SidebarMenuItem key={item.id}>
						<SidebarMenuButton asChild isActive={item.id == chatId}>
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
