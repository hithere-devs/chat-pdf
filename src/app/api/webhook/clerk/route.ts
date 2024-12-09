import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subscription as _subscription } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PLAN_DETALS } from '@/lib/constants';
import type { SubscriptionTier, Models } from '@/lib/constants';

export const POST = async (req: Request) => {
	try {
		const { data, type } = await req.json();
		if (type === 'user.created') {
			// find the subscription with the userId, if not create one
			const subscription = await db
				.select()
				.from(_subscription)
				.where(eq(_subscription.userId, data.id));

			if (!subscription.length) {
				await db.insert(_subscription).values({
					userId: data.id,
				});
			}
		}

		return new Response('Webhook Recieved', { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
};
