'use client';

import { redirect, useParams } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PDFViewer from '@/components/pdf-viewer';
import ChatComponent from '@/components/chat-component';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const ChatPage = () => {
	const { userId } = useAuth();
	const { chatid: chatId }: { chatid: string } = useParams();

	const { data, isLoading, error, isError } = useQuery({
		queryKey: ['chats', chatId],
		queryFn: async () => {
			const response = await axios.post('/api/get-chats', {
				userId,
				chatId,
			});
			return response.data;
		},
		staleTime: 1000 * 60 * 5, // Cache for 5 minutes
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (isError) {
			const errorData = (error as any)?.response?.data;
			if (errorData?.latestChat) {
				toast.loading('Redirecting to latest chat!', {
					id: 'redirecting',
					duration: 3000,
				});
				redirect(`/chat/${errorData.latestChat}`);
			} else {
				toast.error(errorData?.error || 'Upload a PDF to start a chat!');
				redirect('/');
			}
		}
	}, [isError, error]);

	const LoadingSkeleton = () => (
		<div className='w-full h-[92vh] flex'>
			<div className='flex-[5] p-4'>
				<Skeleton className='w-full h-full' />
			</div>
			<div className='flex-[3] p-4'>
				<Skeleton className='w-full h-full' />
			</div>
		</div>
	);

	return (
		<div className='flex max-h-screen overflow-scroll'>
			<div className='flex w-full max-h-screen overflow-scroll'>
				<SidebarProvider>
					<AppSidebar chats={data?.chats || []} chatId={parseInt(chatId)} />
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
													data?.curChat?.pdfName
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

						{isLoading ? (
							<LoadingSkeleton />
						) : (
							data?.curChat && (
								<div className='flex items-end'>
									<div className='max-h-screen h-[92vh] overflow-scroll flex-[5]'>
										<PDFViewer pdfUrl={data.curChat.pdfUrl} />
									</div>
									<div className='flex-[3] p-4 h-[92vh]'>
										<ChatComponent
											fileKey={data.curChat.fileKey}
											chatId={parseInt(chatId)}
										/>
									</div>
								</div>
							)
						)}
					</SidebarInset>
				</SidebarProvider>
			</div>
		</div>
	);
};

export default ChatPage;
