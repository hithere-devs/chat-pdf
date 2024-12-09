import { SubscriptionTier } from '@/lib/constants';
import { BadgeCheck } from 'lucide-react';

export const getSubscriptionBadge = (tier: SubscriptionTier) => {
	const colors = {
		FREE: 'bg-gray-100 text-gray-800',
		BASIC: 'bg-blue-100 text-blue-800',
		PRO: 'bg-purple-100 text-purple-800',
	};

	return (
		<div
			className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[tier]}`}
		>
			<BadgeCheck className='w-4 h-4 mr-1' />
			{tier}
		</div>
	);
};
