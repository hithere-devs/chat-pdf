'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {};

const Notifications = (props: Props) => {
	return (
		<div className='h-[92vh] flex flex-col items-center justify-center p-4'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='text-center space-y-4'
			>
				<div className='flex justify-center'>
					<Bell className='h-12 w-12 text-muted-foreground' />
				</div>
				<h1 className='text-2xl font-semibold'>No notifications yet!</h1>
				<p className='text-muted-foreground max-w-md mx-auto'>
					When you get notifications, they'll show up here. Stay tuned!
				</p>
			</motion.div>
		</div>
	);
};

export default Notifications;
