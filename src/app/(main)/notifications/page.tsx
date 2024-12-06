import React from 'react';
import { Bell } from 'lucide-react';

type Props = {};

const Notifications = (props: Props) => {
	return (
		<div className='flex flex-col items-center justify-center min-h-[400px] p-6'>
			<div className='flex flex-col items-center gap-4'>
				<Bell className='h-12 w-12 text-muted-foreground' />
				<h3 className='text-lg font-semibold'>No notifications yet!</h3>
				<p className='text-sm text-muted-foreground text-center'>
					When you get notifications, they'll show up here
				</p>
			</div>
		</div>
	);
};

export default Notifications;
