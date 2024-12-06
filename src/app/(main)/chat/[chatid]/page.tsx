'use client';

import { redirect, useParams } from 'next/navigation';
import PDFViewer from '@/components/pdf-viewer';
import ChatComponent from '@/components/chat-component';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';

const ChatPage = () => {
	const { userId } = useAuth();
	const { chatid: chatId }: { chatid: string } = useParams();

	const { data, isLoading, error, isError } = useQuery({
		queryKey: ['single-chat', chatId],
		queryFn: async () => {
			const response = await axios.post('/api/get-single-chat', {
				userId,
				chatId,
			});
			return response.data;
		},
		enabled: !!chatId && !!userId,
		staleTime: 1000 * 60 * 50, // Cache for 5 minutes
		refetchOnWindowFocus: false,
		refetchInterval: 1000 * 60 * 50,
		retry: 0,
	});

	useEffect(() => {
		if (isError) {
			const errorData = (error as any)?.response?.data;
			if (errorData?.error === 'No chats found') {
				redirect(`/chat/${errorData.nextChatId}`);
			}
		}
	}, [isError, error]);

	const LoadingSkeleton = () => (
		<div className='w-full h-[92vh] flex max-sm:flex-col'>
			<div className='flex-[5] p-4'>
				<Skeleton className='w-full h-full' />
			</div>
			<div className='flex-[3] p-4'>
				<Skeleton className='w-full h-full' />
			</div>
		</div>
	);

	return (
		<>
			{isLoading ? (
				<LoadingSkeleton />
			) : (
				data?.chat && (
					<div className='flex items-end max-sm:flex-col max-sm:w-full'>
						<div className='max-h-screen h-[92vh] overflow-scroll sm:flex-[5] max-sm:w-screen max-sm:h-[50vh]'>
							<PDFViewer pdfUrl={data.chat.pdfUrl} />
						</div>
						<div className='sm:flex-[3] max-sm:w-screen max-sm:h-[42vh] p-4 h-[92vh]'>
							<ChatComponent
								fileKey={data.chat.fileKey}
								chatId={parseInt(chatId)}
							/>
						</div>
					</div>
				)
			)}
		</>
	);
};

export default ChatPage;
