import React from 'react';
import { type LucideIcon } from 'lucide-react';

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavUser } from './nav-user';
import Link from 'next/link';

export function NavSecondary({
	items,
	user,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
		badge?: React.ReactNode;
	}[];
	user: {
		name: string;
		email: string;
		avatar: string;
	};
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild>
								<Link href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
							{item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
						</SidebarMenuItem>
					))}
					<NavUser user={user} />
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
