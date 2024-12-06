'use client';

import { Slider } from '@/components/ui/slider';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useState } from 'react';

export default function SettingsPage() {
	const [temperature, setTemperature] = useState(0.7);
	const [maxTokens, setMaxTokens] = useState(2048);

	return (
		<>
			<div className='p-4 space-y-6'>
				<div>
					<h2 className='text-xl font-semibold'>Chat Configuration</h2>
				</div>
				<div className='space-y-6'>
					{/* Model Selection */}
					<div className='space-y-2 max-w-xl'>
						<label className='text-sm font-medium'>Select Model</label>
						<Select defaultValue='gpt-3.5-turbo'>
							<SelectTrigger>
								<SelectValue placeholder='Select model' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='gpt-4o'>gpt-4o</SelectItem>
								<SelectItem value='gpt-3.5-turbo'>gpt-3.5-turbo</SelectItem>
								<SelectItem value='gpt-o1-mini'>gpt-o1-mini</SelectItem>
								<SelectItem value='gpt-o1-preview'>gpt-o1-preview</SelectItem>
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
							max={4096}
							min={100}
							step={128}
							className='w-full'
							onValueChange={([value]) => setMaxTokens(value)}
						/>
						<div className='flex justify-between text-xs text-muted-foreground'>
							<span>Min: 100</span>
							<span>Current: {maxTokens}</span>
							<span>Max: 4096</span>
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
			</div>
		</>
	);
}
