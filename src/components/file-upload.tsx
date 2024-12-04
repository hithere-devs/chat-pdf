'use client';

import { uploadToS3 } from '@/lib/s3';
import { Inbox } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = () => {
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
				alert('File size is bigger than 10MB');
				return;
			}
			try {
				const data = await uploadToS3(file);
				console.log('data: ', data);
			} catch (error) {
				console.log(error);
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
				<>
					<Inbox className='w-10 h-10 text-blue-500 ' />
					<p className='mt-2 text-sm text-gray-500'>
						Drag and drop your PDF here
					</p>
				</>
			</div>
		</div>
	);
};

export default FileUpload;
