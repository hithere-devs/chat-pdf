import FileUpload from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import {
	CircleArrowRight,
	CircleArrowUp,
	Copyright,
	LogIn,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
	const { userId } = await auth();
	const isAuth = !!userId;

	return (
		<div className='flex flex-col items-center justify-between w-screen min-h-screen bg-gradient-to-r from-rose-100 to to-teal-100'>
			<div className='w-full flex items-center justify-between p-8'>
				<Link href={'/'}>
					<Image
						src={'/logo.png'}
						alt='Logo for SmartDoc'
						width={40}
						height={40}
					/>
				</Link>
				<UserButton />
			</div>
			<div className='max-w-3xl px-4'>
				<div className='flex flex-col items-center text-center gap-4'>
					<div className='flex items-center'>
						<h1 className='text-5xl max-sm:text-4xl max-sm:px-2 font-semibold font-serif leading-snug'>
							Silent Pages to Active Chats
						</h1>
					</div>

					<p className='max-w-2xl mt-1 text-lg text-slate-600 leading-tight'>
						Empowering students, researchers, developers and professionals to
						explore ideas, answer questions, and uncover insights using advanced
						AI
					</p>
					<div className='flex flex-row mt-2 gap-4'>
						{isAuth && (
							<Link href={'/chat/1'}>
								<Button>
									Go to Chats <CircleArrowRight />
								</Button>
							</Link>
						)}
						{isAuth && (
							<Link href={'/account'}>
								<Button variant={'outline'}>Manage Subscription</Button>
							</Link>
						)}
					</div>
					<div className='w-full mt-4'>
						{isAuth ? (
							<FileUpload />
						) : (
							<Link
								href={'/sign-in'}
								className='flex gap-4 items-center justify-center'
							>
								<Button>
									Login to get started
									<LogIn />
								</Button>
								<Button variant={'outline'}>
									Upload a Document <CircleArrowUp />
								</Button>
							</Link>
						)}
					</div>
				</div>
			</div>
			<div className='flex items-center justify-between p-8 text-sm text-slate-600'>
				product by
				<a
					href='https://hitheredevs.com'
					target='_blank'
					rel='noopener noreferrer'
					className='ml-1 text-sm'
				>
					hitheredevs.com
				</a>
				<Copyright className='w-4 h-4 mx-2' /> 2024
			</div>
		</div>
	);
}
