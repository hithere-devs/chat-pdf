'use client';

import { Slider } from '@/components/ui/slider';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MODELS, PLAN_DETALS } from '@/lib/constants';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/nextjs';

export default function SettingsPage() {
	const [temperature, setTemperature] = useState(0.7);
	const planDetails = PLAN_DETALS['PRO'];
	const [maxTokens, setMaxTokens] = useState(() => planDetails.maxTokens / 2);
	const [model, setModel] = useState('gpt-3.5-turbo');

	const { userId } = useAuth();

	const updateSettingsMutation = useMutation({
		mutationFn: async () => {
			const response = await axios.post('/api/update-settings', {
				userId,
				plan: 'PRO', // You might want to make this dynamic
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

	const handleSaveSettings = () => {
		updateSettingsMutation.mutate();
		console.log(updateSettingsMutation.data);
	};

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
						<Select
							defaultValue={model}
							onValueChange={(value) => {
								setModel(value);
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder='Select model' />
							</SelectTrigger>
							<SelectContent>
								{MODELS.map((model) => (
									<SelectItem
										disabled={!planDetails.models.includes(model)}
										value={model}
									>
										{model}
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
					onClick={handleSaveSettings}
					disabled={updateSettingsMutation.isPending}
				>
					Save Changes
				</Button>
			</div>
		</>
	);
}
