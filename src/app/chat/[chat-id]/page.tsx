import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react';
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

type Props = {
	params: {
		'chat-id': string;
	};
};

const ChatPage = async ({ params }: Props) => {
	const { userId } = await auth();
	const chatId = params['chat-id'];

	if (!userId) return redirect('/sign-in');

	const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
	const curChat = _chats?.find((c) => c.id === parseInt(chatId));

	if (!_chats || !curChat) {
		return redirect('/');
	}

	return (
		<div className='flex max-h-screen overflow-scroll '>
			<div className='flex w-full max-h-screen overflow-scroll'>
				{/* chat sidebar */}
				<SidebarProvider>
					<AppSidebar chats={_chats} chatId={parseInt(chatId)} />
					<SidebarInset>
						<header className='flex h-14 shrink-0 items-center gap-2'>
							<div className='flex flex-1 items-center gap-2 px-3'>
								<SidebarTrigger />
								<Separator orientation='vertical' className='mr-2 h-4' />
								<Breadcrumb>
									<BreadcrumbList>
										<BreadcrumbItem>
											<BreadcrumbPage className='line-clamp-6'>
												{curChat.pdfName}
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
						{/* pdf viewer */}
						<div className='flex items-end'>
							<div className='max-h-screen h-[92vh] overflow-scroll flex-[5]'>
								<PDFViewer pdfUrl={curChat.pdfUrl} />
							</div>
							{/* chat component */}
							<div className='flex-[3] p-4 h-[92vh]'>
								<ChatComponent />
							</div>
						</div>
					</SidebarInset>
				</SidebarProvider>
			</div>
		</div>
	);
};

export default ChatPage;
