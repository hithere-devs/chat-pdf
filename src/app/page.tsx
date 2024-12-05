import FileUpload from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
	const { userId } = await auth();
	const isAuth = !!userId;

	return (
		<div className='w-screen min-h-screen bg-gradient-to-r from-rose-100 to to-teal-100'>
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
				<div className='flex flex-col items-center text-center'>
					<div className='flex items-center'>
						<h1 className='mr-3 text-5xl font-semibold'>
							Chat with your PDFs
							<UserButton afterSignOutUrl='/' />
						</h1>
					</div>
					<div className='flex mt-2'>
						{isAuth && (
							<Button>
								<Link href={'/chat/1'}>Go to Chats</Link>
							</Button>
						)}
					</div>
					<p className='max-w-xl mt-1 text-lg text-slate-600'>
						Join millions of students researchers and professionals to instantly
						answer questions and understand research using AI
					</p>
					<div className='w-full mt-4'>
						{isAuth ? (
							<FileUpload />
						) : (
							<Link href={'/sign-in'}>
								<Button>
									Login to get started
									<LogIn />
								</Button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
