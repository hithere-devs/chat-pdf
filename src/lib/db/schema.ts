import {
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import { MODELS, SUBSCRIPTION_PLANS, USER_SYSTEM_ENUMS } from '../constants';

export const userSystemEnum = pgEnum('user_system_enum', USER_SYSTEM_ENUMS);
export const plansEnum = pgEnum('plans_enum', SUBSCRIPTION_PLANS);
export const modelsEnum = pgEnum('models_enum', MODELS);

export const chats = pgTable('chats', {
	id: serial('id').primaryKey(),
	pdfName: text('pdf_name').notNull(),
	pdfUrl: text('pdf_url').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	userId: varchar('user_id', { length: 256 }).notNull(),
	fileKey: text('file_key').notNull(),
});

export const messages = pgTable('messages', {
	id: serial('id').primaryKey(),
	chatId: integer('chat_id')
		.notNull()
		.references(() => chats.id)
		.notNull(),
	content: text('content').notNull(),
	role: userSystemEnum('role').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const subscription = pgTable('subscription', {
	id: serial('id').primaryKey(),
	userId: varchar('user_id', { length: 256 }).notNull(),
	stripeId: varchar('stripe_id', { length: 256 }).notNull(),
	plan: plansEnum('plan').notNull().default('FREE'),
	currentModel: modelsEnum('current_model').notNull().default('gpt-3.5-turbo'),
	maxTokens: integer('max_tokens').notNull().default(612),
	numberOfDocs: integer('number_of_docs').notNull().default(1),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Chat = typeof chats.$inferSelect;
