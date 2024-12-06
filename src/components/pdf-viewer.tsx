import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
	pdfUrl: string;
};

const PDFViewer = ({ pdfUrl }: Props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	const handleLoad = () => {
		setIsLoading(false);
	};

	const handleError = () => {
		setIsLoading(false);
		setHasError(true);
	};

	return (
		<div className='relative w-full h-full'>
			{isLoading && (
				<div className='absolute inset-0'>
					<div className='flex flex-col gap-4 h-full p-4'>
						<Skeleton className='w-full h-16' />
						<Skeleton className='w-3/4 h-8' />
						<Skeleton className='flex-1' />
						<div className='grid grid-cols-3 gap-4'>
							<Skeleton className='h-8' />
							<Skeleton className='h-8' />
							<Skeleton className='h-8' />
						</div>
					</div>
				</div>
			)}

			{hasError ? (
				<div className='absolute inset-0 flex items-center justify-center bg-red-50'>
					<p className='text-red-500'>
						Failed to load PDF. Please try again later.
					</p>
				</div>
			) : (
				<iframe
					src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`}
					className='w-full h-full border-0'
					onLoad={handleLoad}
					onError={handleError}
				/>
			)}
		</div>
	);
};

export default PDFViewer;
