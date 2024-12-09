'use client';

import { Slider } from '@/components/ui/slider';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MODELS, PLAN_DETALS, SubscriptionTier } from '@/lib/constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/nextjs';

export default function SettingsPage() {
	const { userId } = useAuth();
	const [temperature, setTemperature] = useState(0.7);
	const [plan, setPlan] = useState<SubscriptionTier>('FREE');
	const [maxTokens, setMaxTokens] = useState(0);
	const [model, setModel] = useState('gpt-3.5-turbo');

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
			setModel(sub.currentModel);
			setMaxTokens(sub.maxTokens);
		}
	}, [subscriptionData]);

	const planDetails = PLAN_DETALS[plan];

	const updateSettingsMutation = useMutation({
		mutationFn: async () => {
			const response = await axios.post('/api/update-settings', {
				userId,
				plan,
				model,
				maxTokens,
			});
			return response.data;
		},
		retry: 0,
		onSuccess: (data) => {
			toast.success('Settings updated successfully');
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.error || 'Failed to update settings');
		},
	});

	if (isLoading) {
		return (
			<div className='p-4 space-y-6'>
				<Skeleton className='h-8 w-[200px]' />
				<Skeleton className='h-[400px] w-full max-w-xl' />
			</div>
		);
	}

	return (
		<>
			<div className='p-4 space-y-6'>
				<div>
					<h2 className='text-xl font-semibold'>Chat Configuration</h2>
				</div>
				<div className='space-y-6'>
					{/* Model Selection */}
					<div className='space-y-2 max-w-xl'>
						<label className='text-sm font-medium'>Select Chat Model</label>
						<Select value={model} onValueChange={(value) => setModel(value)}>
							<SelectTrigger>
								<SelectValue placeholder='Select model' />
							</SelectTrigger>
							<SelectContent>
								{MODELS.map((m) => (
									<SelectItem
										key={m}
										disabled={!planDetails.models.includes(m)}
										value={m}
									>
										{m}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Temperature Control */}
					<div className='space-y-2  max-w-xl'>
						<label className='text-sm font-medium'>Temperature</label>
						<Slider
							defaultValue={[temperature]}
							max={2}
							min={0.1}
							step={0.1}
							className='w-full'
							onValueChange={([value]) => setTemperature(value)}
						/>
						<div className='flex justify-between text-xs text-muted-foreground'>
							<span>Min: 0.1</span>
							<span>Current: {temperature}</span>
							<span>Max: 2</span>
						</div>
						<p className='text-xs text-muted-foreground'>
							Controls randomness: Lower values make responses more focused,
							higher values make them more creative.
						</p>
					</div>

					{/* Max Tokens */}
					<div className='space-y-2  max-w-xl'>
						<label className='text-sm font-medium'>Maximum Tokens</label>
						<Slider
							defaultValue={[maxTokens]}
							max={planDetails.maxTokens}
							min={100}
							step={128}
							className='w-full'
							onValueChange={([value]) => setMaxTokens(value)}
						/>
						<div className='flex justify-between text-xs text-muted-foreground'>
							<span>Min: 100</span>
							<span>Current: {maxTokens}</span>
							<span>Max: {planDetails.maxTokens}</span>
						</div>
						<p className='text-xs text-muted-foreground'>
							Maximum number of tokens to generate in the response.
						</p>
					</div>

					{/* System Message */}
					<div className='space-y-2 max-w-xl'>
						<label className='text-sm font-medium'>System Message</label>
						<textarea
							className='w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm'
							placeholder='Enter system message...'
							defaultValue='You are a helpful AI assistant.'
						/>
						<p className='text-xs text-muted-foreground'>
							Define the AI's behavior and context for the conversation.
						</p>
					</div>
				</div>

				<Button
					onClick={() => updateSettingsMutation.mutate()}
					disabled={updateSettingsMutation.isPending || isLoading}
				>
					{updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
				</Button>
			</div>
		</>
	);
}
