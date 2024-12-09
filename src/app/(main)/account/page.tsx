'use client';

import React, { useEffect } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';

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
	const userId = user?.id;
	const [plan, setPlan] = React.useState<SubscriptionTier | null>(null);

	const [showApiKey, setShowApiKey] = React.useState(false);

	// Fetch subscription details
	const { data: subscriptionData, isLoading } = useQuery({
		queryKey: ['subscription', userId],
		queryFn: async () => {
			const response = await axios.post('/api/get-subscription', { userId });
			return response.data;
		},
		enabled: !!userId,
		retry: 1,
		staleTime: 1000 * 60 * 50, // Cache for 5 minutes
		refetchOnWindowFocus: false,
		refetchInterval: 1000 * 60 * 50,
	});

	// Update state when subscription data is loaded
	useEffect(() => {
		if (subscriptionData?.subscription) {
			const sub = subscriptionData.subscription;
			setPlan(sub.plan as SubscriptionTier);
		}
	}, [subscriptionData]);

	const handleDeleteAccount = async () => {
		console.log('Deleting account...');
		// await user?.delete();
		// router.push('/');
		// window.location.;
	};

	const SubscriptionSkeleton = () => (
		<div className='space-y-2 max-w-xl'>
			<Skeleton className='h-4 w-48' /> {/* For description text */}
			<div className='rounded-md border border-input bg-background p-4 space-y-4'>
				<div className='space-y-2'>
					<Skeleton className='h-4 w-24' /> {/* For "Current Plan" label */}
					<Skeleton className='h-8 w-32' /> {/* For plan badge */}
				</div>
				<Skeleton className='h-9 w-40' /> {/* For upgrade button */}
			</div>
		</div>
	);

	const AccountButtonsSkeleton = () => (
		<div className='flex gap-6'>
			<Skeleton className='h-9 w-[100px]' /> {/* Sign out button skeleton */}
			<Skeleton className='h-9 w-[120px]' />{' '}
			{/* Delete account button skeleton */}
		</div>
	);

	const PersonalInfoSkeleton = () => (
		<div className='space-y-2 max-w-xl'>
			<Skeleton className='h-4 w-48' /> {/* Description text skeleton */}
			<div className='rounded-md border border-input bg-background p-4 flex items-start justify-between max-sm:flex-col-reverse'>
				<div className='space-y-6'>
					{/* Name section */}
					<div className='space-y-1'>
						<Skeleton className='h-4 w-16' /> {/* Label */}
						<Skeleton className='h-5 w-32' /> {/* Value */}
					</div>
					{/* Email section */}
					<div className='space-y-1'>
						<Skeleton className='h-4 w-16' />
						<Skeleton className='h-5 w-48' />
					</div>
					{/* Member since section */}
					<div className='space-y-1'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-5 w-36' />
					</div>
					{/* User ID section */}
					<div className='space-y-1'>
						<Skeleton className='h-4 w-16' />
						<div className='flex items-center justify-between gap-4'>
							<Skeleton className='h-5 w-64' />
							<Skeleton className='h-4 w-4' /> {/* Eye icon */}
						</div>
					</div>
				</div>
				{/* Avatar section */}
				<div className='flex flex-col max-sm:flex-col-reverse max-sm:mb-5 items-center gap-2'>
					<Skeleton className='h-20 w-20 rounded-full' />
					<Skeleton className='h-4 w-24' />
				</div>
			</div>
		</div>
	);

	const AccountManagementSkeleton = () => (
		<div className='space-y-2 max-w-xl'>
			<Skeleton className='h-4 w-64 mb-4' /> {/* Description text */}
			<div className='flex gap-6'>
				<Skeleton className='h-9 w-[100px]' /> {/* Sign out button */}
				<Skeleton className='h-9 w-[120px]' /> {/* Delete account button */}
			</div>
		</div>
	);

	return (
		<div className='p-4 space-y-6'>
			<div className='space-y-6'>
				{/* Personal Information */}
				{!user ? (
					<PersonalInfoSkeleton />
				) : (
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
									<label className='text-sm text-muted-foreground'>
										User Id
									</label>
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
				)}

				{/* Subscription */}
				{isLoading || !plan ? (
					<SubscriptionSkeleton />
				) : (
					<div className='space-y-2 max-w-xl'>
						<p className='text-xs text-muted-foreground'>
							Manage your subscription plan and billing information.
						</p>
						<div className='rounded-md border border-input bg-background p-4 space-y-4'>
							<div className='space-y-2'>
								<label className='text-sm text-muted-foreground'>
									Current Plan
								</label>
								<div>{getSubscriptionBadge(plan)}</div>
							</div>
							<Button
								variant='outline'
								size='sm'
								className='w-full sm:w-auto'
								disabled={plan === 'PRO'}
							>
								<Stars className='w-4 h-4 mr-2' />
								{plan === 'PRO'
									? 'Already on the best plan'
									: 'Upgrade Subscription'}
							</Button>
						</div>
					</div>
				)}

				{/* Account Management */}
				{!user ? (
					<AccountManagementSkeleton />
				) : (
					<div className='space-y-2 max-w-xl'>
						<p className='text-xs text-muted-foreground mb-4'>
							Manage your account access and deletion options.
						</p>
						<div className='flex gap-6'>
							<SignOutButton>
								<Button
									variant='outline'
									size='sm'
									className='w-full sm:w-auto'
								>
									<LogOut className='w-4 h-4 mr-2' />
									Sign out
								</Button>
							</SignOutButton>

							{!user ? (
								<AccountButtonsSkeleton />
							) : (
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
												This action cannot be undone. This will permanently
												delete your account and remove all your data from our
												servers.
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
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
