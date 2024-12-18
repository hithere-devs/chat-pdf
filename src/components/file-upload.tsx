'use client';

import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { ArrowUp, CircleArrowUp, Inbox, Loader2, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

const FileUpload = () => {
	const router = useRouter();
	const [uploading, setUploading] = useState(false);

	const { mutate, isPending } = useMutation({
		mutationFn: async ({
			file_key,
			file_name,
		}: {
			file_key: string;
			file_name: string;
		}) => {
			const response = await axios.post('/api/create-chat', {
				file_key,
				file_name,
			});
			return response.data;
		},
	});

	const { getRootProps, getInputProps } = useDropzone({
		accept: { 'application/pdf': ['.pdf'] },
		maxFiles: 1,
		onDrop: async (acceptedFiles, fileRejections, event) => {
			console.log(acceptedFiles);
			console.log(fileRejections);
			console.log(event);
			const file = acceptedFiles[0];
			if (file.size > 1024 * 1024 * 10) {
				// bigger than 10MB
				toast.error('File too large, bigger than 10MB');
				// alert('File size is bigger than 10MB');
				return;
			}
			try {
				setUploading(true);
				const data = await uploadToS3(file);
				if (!data?.file_key || !data?.file_name) {
					toast.error('Failed to upload file');
					return;
				}
				mutate(data, {
					onSuccess: ({ chat_id, message }) => {
						// console.log(chat_id);
						toast.success(message);
						router.push(`/chat/${chat_id}`);
					},
					onError: (error) => {
						console.log(error);
						toast.error('Error creating chat');
					},
				});
			} catch (error) {
				console.log(error);
			} finally {
				setUploading(false);
			}
		},
	});

	return (
		<div className='p-2 bg-white rounded-xl'>
			<div
				{...getRootProps({
					className:
						'border-dashed border-2 bg-gray-50 rounded-xl cursor-pointer py-8 flex justify-center items-center flex-col',
				})}
			>
				<input {...getInputProps()} />
				{uploading || isPending ? (
					<>
						<Loader2 className='h-10 w-10 text-blue-500 animate-spin' />
						<p className='mt-2 text-sm text-gray-500'>Spilling Tea to GPT...</p>
					</>
				) : (
					<>
						<Inbox className='w-10 h-10 text-blue-500 ' />
						<p className='my-4 text-sm text-gray-500'>
							Click to upload, or drag PDF here
						</p>
						<Button className='bg-blue-500 hover:bg-blue-200 hover:text-black'>
							Upload File <CircleArrowUp />
						</Button>
					</>
				)}
			</div>
		</div>
	);
};

export default FileUpload;
