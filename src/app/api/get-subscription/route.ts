import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subscription as _subscription } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const POST = async (req: Request) => {
	try {
		let { userId } = await req.json();

		// fetch subscription
		const subscription = await db
			.select()
			.from(_subscription)
			.where(eq(_subscription.userId, userId));

		if (!subscription.length) {
			return NextResponse.json(
				{ error: 'Subscription not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			message: 'Subscription updated successfully',
			subscription: subscription[0],
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
};
