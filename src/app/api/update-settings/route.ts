import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subscription } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PLAN_DETALS } from '@/lib/constants';
import type { SubscriptionTier, Models } from '@/lib/constants';

export const POST = async (req: Request, res: Response) => {
	try {
		const { userId, plan, model, maxTokens } = await req.json();

		// Validate plan exists
		if (!Object.keys(PLAN_DETALS).includes(plan)) {
			return NextResponse.json(
				{ error: 'Invalid subscription plan' },
				{ status: 400 }
			);
		}

		// Get plan details
		const planDetails = PLAN_DETALS[plan as SubscriptionTier];

		// Validate model is allowed for plan
		if (!planDetails.models.includes(model as Models)) {
			return NextResponse.json(
				{ error: 'Model not available in selected plan' },
				{ status: 400 }
			);
		}

		// Validate maxTokens is within plan limit
		if (maxTokens > planDetails.maxTokens) {
			return NextResponse.json(
				{ error: 'Tokens exceed the limit available in selected plan' },
				{ status: 400 }
			);
		}

		// Update subscription
		const updated = await db
			.update(subscription)
			.set({
				plan: plan,
				currentModel: model,
				maxTokens: maxTokens,
			})
			.where(eq(subscription.userId, userId))
			.returning();

		if (!updated.length) {
			return NextResponse.json(
				{ error: 'Subscription not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			message: 'Subscription updated successfully',
			subscription: updated[0],
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
};
