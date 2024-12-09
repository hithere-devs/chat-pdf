'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogTrigger,
	AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
	LogOut,
	Trash2,
	BadgeCheck,
	Settings,
	EyeOff,
	Eye,
	Stars,
} from 'lucide-react';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { SubscriptionTier } from '@/lib/constants';
import { getSubscriptionBadge } from '@/components/subs-badge';

interface UserInfo {
	name: string;
	email: string;
	subscription: SubscriptionTier;
	joinedDate: string;
}

const userInfo: UserInfo = {
	name: 'John Doe',
	email: 'john@example.com',
	subscription: 'BASIC',
	joinedDate: 'January 2024',
};

export default function AccountPage() {
	const { user } = useUser();
	const router = useRouter();

	const [showApiKey, setShowApiKey] = React.useState(false);

	const handleDeleteAccount = async () => {
		console.log('Deleting account...');
		// await user?.delete();
		// router.push('/');
		// window.location.;
	};

	return (
		<div className='p-4 space-y-6'>
			<div className='space-y-6'>
				{/* Personal Information */}
				<div className='space-y-2 max-w-xl'>
					{/* <label className='text-sm font-medium'>Personal Information</label> */}
					<p className='text-xs text-muted-foreground'>
						The account you're loggedin with now.
					</p>
					<div className='rounded-md border border-input bg-background p-4  flex items-start justify-between max-sm:flex-col-reverse'>
						<div className='space-y-6'>
							<div className='space-y-1'>
								<label className='text-sm text-muted-foreground'>Name</label>
								<p className='text-sm font-medium'>{user?.fullName}</p>
							</div>
							<div className='space-y-1'>
								<label className='text-sm text-muted-foreground'>Email</label>
								<p className='text-sm font-medium'>
									{user?.emailAddresses[0].emailAddress}
								</p>
							</div>
							<div className='space-y-1'>
								<label className='text-sm text-muted-foreground'>
									Member since
								</label>
								<p className='text-sm font-medium'>
									{user?.createdAt?.toDateString()}
								</p>
							</div>

							<div className='space-y-1'>
								<label className='text-sm text-muted-foreground'>User Id</label>
								<div className='flex items-center justify-between gap-4'>
									<p className='text-sm font-medium font-mono'>
										{showApiKey
											? user?.id
											: '•••••••••••••••••••••••••••••••••'}
									</p>
									<button
										onClick={() => setShowApiKey((prev) => !prev)}
										className='text-muted-foreground hover:text-foreground'
									>
										{showApiKey ? (
											<Eye className='h-4 w-4' />
										) : (
											<EyeOff className='h-4 w-4' />
										)}
									</button>
								</div>
							</div>
						</div>
						<div className='flex flex-col max-sm:flex-col-reverse max-sm:mb-5 items-center gap-2'>
							<Avatar className='h-20 w-20'>
								<AvatarImage src={user?.imageUrl} />
								<AvatarFallback>
									{user?.firstName?.charAt(0)}
									{user?.lastName?.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<label className='text-sm text-muted-foreground'>
								Profile Picture
							</label>
						</div>
					</div>
				</div>

				{/* Subscription */}
				<div className='space-y-2 max-w-xl'>
					{/* <label className='text-sm font-medium'>Subscription Plan</label> */}
					<p className='text-xs text-muted-foreground'>
						Manage your subscription plan and billing information.
					</p>
					<div className='rounded-md border border-input bg-background p-4 space-y-4'>
						<div className='space-y-2'>
							<label className='text-sm text-muted-foreground'>
								Current Plan
							</label>
							<div>{getSubscriptionBadge(userInfo.subscription)}</div>
						</div>
						<Button
							variant='outline'
							size='sm'
							className='w-full sm:w-auto'
							disabled={userInfo.subscription === 'PRO'}
						>
							<Stars className='w-4 h-4 mr-2' />
							{userInfo.subscription === 'PRO'
								? 'Already on the best plan'
								: 'Upgrade Subscription'}
						</Button>
					</div>
				</div>

				{/* Account Management */}
				<div className='space-y-2 max-w-xl'>
					<p className='text-xs text-muted-foreground mb-4'>
						Manage your account access and deletion options.
					</p>
					<div className='flex gap-6'>
						<SignOutButton>
							<Button variant='outline' size='sm' className='w-full sm:w-auto'>
								<LogOut className='w-4 h-4 mr-2' />
								Sign out
							</Button>
						</SignOutButton>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant='destructive'
									size='sm'
									className='w-full sm:w-auto'
								>
									<Trash2 className='w-4 h-4 mr-2' />
									Delete Account
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete Account</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										your account and remove all your data from our servers.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={handleDeleteAccount}>
										Delete Account
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			</div>
		</div>
	);
}
