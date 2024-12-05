'use client';

import { useParams } from 'next/navigation';
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
import { Chat } from '@/lib/db/schema';

type Props = {
	params: {
		'chat-id': string;
	};
};

const ChatPage = ({ params }: Props) => {
	const { userId } = useAuth();
	const { chatid: chatId }: { chatid: string } = useParams();

	// if (!userId) return redirect('/sign-in');

	// const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

	const { data, isLoading } = useQuery({
		queryKey: ['dddd'],
		queryFn: async () => {
			const response = await axios.post('/api/get-chats', {
				userId,
				chatId,
			});
			return response.data;
		},
	});

	// if (isLoading) return <div>Loading...</div>;

	const _chats = data?.chats;
	const curChat = data?.curChat as Chat;

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className='flex max-h-screen overflow-scroll '>
			<div className='flex w-full max-h-screen overflow-scroll'>
				<SidebarProvider>
					<AppSidebar chats={_chats || []} chatId={parseInt(chatId)} />
					<SidebarInset>
						<header className='flex h-14 shrink-0 items-center gap-2'>
							<div className='flex flex-1 items-center gap-2 px-3'>
								<SidebarTrigger />
								<Separator orientation='vertical' className='mr-2 h-4' />
								<Breadcrumb>
									<BreadcrumbList>
										<BreadcrumbItem>
											<BreadcrumbPage className='line-clamp-6'>
												{curChat?.pdfName || ' '}
											</BreadcrumbPage>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</div>
							<div className='ml-auto px-3'>
								<Button variant='default'>
									<span>New Chat</span>
									<PlusIcon />
								</Button>
							</div>
						</header>

						{curChat && (
							<div className='flex items-end'>
								<div className='max-h-screen h-[92vh] overflow-scroll flex-[5]'>
									<PDFViewer pdfUrl={curChat.pdfUrl} />
								</div>

								<div className='flex-[3] p-4 h-[92vh]'>
									<ChatComponent
										fileKey={curChat.fileKey}
										chatId={parseInt(chatId)}
									/>
								</div>
							</div>
						)}
					</SidebarInset>
				</SidebarProvider>
			</div>
		</div>
	);
};

export default ChatPage;
