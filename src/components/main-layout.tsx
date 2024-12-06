'use client';

import { Chat } from '@/lib/db/schema';
import { AppSidebar } from './app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from './ui/sidebar';
import axios from 'axios';
import { redirect, useParams, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/nextjs';
import { Separator } from './ui/separator';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from './ui/breadcrumb';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import { Button } from './ui/button';
import { PlusIcon } from 'lucide-react';

export function MainLayoutComp({ children }: { children: React.ReactNode }) {
	const { userId } = useAuth();
	const { chatid: chatId }: { chatid: string } = useParams();
	const path = usePathname();
	const breadCrumbs =
		path.split('/')[1].charAt(0).toUpperCase() + path.split('/')[1].slice(1);

	const { data, isLoading, error, isError } = useQuery({
		queryKey: ['chats', chatId],
		queryFn: async () => {
			const response = await axios.post('/api/get-chats', {
				userId,
				chatId,
			});
			return response.data;
		},
		enabled: !!userId && !!chatId,
		staleTime: 1000 * 60 * 50, // Cache for 50 minutes
		refetchOnWindowFocus: false,
		refetchInterval: 1000 * 60 * 50,
		retry: 0,
	});

	useEffect(() => {
		if (isError && breadCrumbs === 'Chat') {
			// @ts-ignore
			const errorMessage = error?.response?.data?.error;
			console.log(errorMessage);
			if (errorMessage === 'No chats found') {
				toast.error('No chats found. Upload a pdf to create a new chat!');
				redirect('/');
			}
		}
	}, [isError, error]);

	return (
		<div className='flex max-h-screen overflow-scroll'>
			<div className='flex w-full max-h-screen overflow-scroll'>
				<SidebarProvider>
					<AppSidebar
						chats={data?.chats || []}
						chatId={parseInt(chatId) || data?.chats[0].id}
					/>
					<SidebarInset>
						<header className='flex h-14 shrink-0 items-center gap-2'>
							<div className='flex flex-1 items-center gap-2 px-3'>
								<SidebarTrigger />
								<Separator orientation='vertical' className='mr-2 h-4' />
								<Breadcrumb>
									<BreadcrumbList>
										<BreadcrumbItem>
											<BreadcrumbPage className='line-clamp-6'>
												{isLoading ? (
													<Skeleton className='w-40 h-4' />
												) : (
													`${breadCrumbs}`
												)}
											</BreadcrumbPage>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</div>
							<div className='ml-auto px-3'>
								<Link href={'/'}>
									<Button variant='default'>
										<span>New Chat</span>
										<PlusIcon />
									</Button>
								</Link>
							</div>
						</header>
						{children}
					</SidebarInset>
				</SidebarProvider>
			</div>
		</div>
	);
}
