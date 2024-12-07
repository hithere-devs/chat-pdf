export type SubscriptionTier = 'FREE' | 'BASIC' | 'PRO';
export type Models =
	| 'gpt-3.5-turbo'
	| 'gpt-4o'
	| 'gpt-o1-mini'
	| 'gpt-o1-preview';

export const SUBSCRIPTION_PLANS = ['FREE', 'BASIC', 'PRO'] as const;
export const USER_SYSTEM_ENUMS = ['system', 'user'] as const;
export const MODELS = [
	'gpt-3.5-turbo',
	'gpt-4o',
	'gpt-o1-mini',
	'gpt-o1-preview',
] as const;

export const PLAN_DETALS = {
	FREE: {
		name: 'Free',
		price: 0,
		numberOfDocs: 1,
		maxTokens: 612,
		models: ['gpt-3.5-turbo'],
	},
	BASIC: {
		name: 'Basic',
		price: 10,
		numberOfDocs: 5,
		maxTokens: 1508,
		models: ['gpt-3.5-turbo', 'gpt-4o'],
	},
	PRO: {
		name: 'Pro',
		price: 50,
		numberOfDocs: 20,
		maxTokens: 4096,
		models: ['gpt-3.5-turbo', 'gpt-4o', 'gpt-o1-mini', 'gpt-o1-preview'],
	},
};
