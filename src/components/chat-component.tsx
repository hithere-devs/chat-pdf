'use client';

import { Send } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Message, useChat } from 'ai/react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { messages as _messages } from '@/lib/db/schema';
import { Skeleton } from './ui/skeleton';

type Props = {
	fileKey: string;
	chatId: number;
};

const ChatComponentSkeleton = () => {
	return (
		<div className='h-full flex flex-col items-center justify-end'>
			<div className='flex w-full flex-col gap-3 overflow-y-scroll pb-3'>
				{/* Message bubbles skeleton */}
				<div className='flex flex-col gap-4'>
					{[...Array(3)].map((_, i) => (
						<div key={i} className='flex flex-col gap-3'>
							{/* Assistant message skeleton */}
							<div className='self-start'>
								<Skeleton className='h-[40px] w-[200px] rounded-2xl' />
							</div>
							{/* User message skeleton */}
							<div className='self-end'>
								<Skeleton className='h-[40px] w-[180px] rounded-2xl' />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Input box skeleton */}
			<div className='w-full p-4'>
				<Skeleton className='h-9 w-full rounded-full' />
			</div>
		</div>
	);
};

const ChatComponent = ({ fileKey, chatId }: Props) => {
	const { data, isLoading } = useQuery({
		queryKey: ['chat', chatId],
		queryFn: async () => {
			const response = await axios.post('/api/get-messages', {
				chatId,
			});
			return response.data;
		},
	});

	const chatRef = useRef<HTMLDivElement | null>(null);
	const [isResponseLoading, setIsResponseLoading] = useState(false);

	const { input, handleInputChange, handleSubmit, messages } = useChat({
		api: '/api/chat',
		body: {
			fileKey,
			chatId,
		},
		onError: (error) => {
			console.error('Error in Chat', error);
			setIsResponseLoading(false);
		},
		initialMessages: data || [],
	});

	const adjustScrollInChat = () => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		adjustScrollInChat();
		if (
			messages[messages.length - 1]?.role === 'assistant' &&
			isResponseLoading
		) {
			setIsResponseLoading(false);
		}
	}, [messages]);

	// this isLoading is from the useQuery hook not useChat hook take care
	if (isLoading) {
		return <ChatComponentSkeleton />;
	}

	return (
		<div className='h-full flex flex-col items-center justify-end'>
			<div
				className='flex w-full flex-col gap-2 overflow-y-scroll pb-3'
				id='message-container'
				ref={chatRef}
			>
				<AnimatePresence mode='sync'>
					{messages.map((message: Message) => (
						<motion.div
							key={message.id}
							layout='position'
							className={cn(
								'z-10 mt-2 max-w-[250px] break-words rounded-2xl bg-gray-200 dark:bg-gray-800',
								{
									'self-start text-gray-900 dark:text-gray-100':
										message.role === 'assistant',
									'self-end !bg-blue-500 text-white': message.role === 'user',
								}
							)}
							layoutId={`container-[${messages.length - 1} ]`}
							transition={{
								type: 'easeOut',
								duration: 0.2,
							}}
						>
							<div className='px-3 py-2 text-[13px] leading-[15px]'>
								{message.content}
							</div>
						</motion.div>
					))}
				</AnimatePresence>
				{isResponseLoading && (
					<motion.div
						layout='position'
						className={cn(
							'z-10 mt-2 max-w-[250px] break-words rounded-2xl dark:bg-gray-800 self-start !bg-blue-500 text-white'
						)}
						layoutId={`container-[${messages.length - 1} ]`}
						transition={{
							type: 'easeOut',
							duration: 0.2,
						}}
					>
						<div className='px-3 py-2 text-[13px] leading-[15px] flex items-center justify-center space-x-2'>
							<div
								className='w-1 h-1 rounded-full bg-primary animate-dot-pulse'
								style={{ animationDelay: '0s' }}
							></div>
							<div
								className='w-1 h-1 rounded-full bg-primary animate-dot-pulse'
								style={{ animationDelay: '0.2s' }}
							></div>
							<div
								className='w-1 h-1 rounded-full bg-primary animate-dot-pulse'
								style={{ animationDelay: '0.4s' }}
							></div>
						</div>
					</motion.div>
				)}
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
					messages[messages.length - 1]?.role === 'assistant' &&
						setIsResponseLoading(true);
				}}
				className='flex w-full'
			>
				<input
					type='text'
					placeholder='Ask AI...'
					className='relative h-9 flex-grow rounded-full border border-gray-200 bg-white px-3 py-1 text-[13px] outline-none placeholder:text-[13px] dark:bg-black'
					value={input}
					onChange={handleInputChange}
					onClick={adjustScrollInChat}
				/>

				<motion.div
					key={messages.length}
					className='pointer-events-none absolute z-10 flex h-9 w-[250px] items-center overflow-hidden break-words rounded-full bg-gray-200 [word-break:break-word] dark:bg-gray-800'
					layout='position'
					layoutId={`container-[${messages.length}]`}
					transition={{
						type: 'easeOut',
						duration: 0.2,
					}}
					initial={{ opacity: 0.6, zIndex: -1 }}
					animate={{ opacity: 0.6, zIndex: -1 }}
					exit={{ opacity: 1, zIndex: 1 }}
				>
					<div className='px-3 py-2 text-[13px] leading-[15px] text-gray-900 dark:text-gray-100'>
						{input}
					</div>
				</motion.div>

				<button
					type='submit'
					className='ml-3 flex w-14 items-center justify-center rounded-full bg-gray-200 px-2 dark:bg-gray-800'
				>
					<Send className='size-4 text-gray-500 dark:text-gray-300' />
				</button>
			</form>
		</div>
	);
};

export default ChatComponent;
