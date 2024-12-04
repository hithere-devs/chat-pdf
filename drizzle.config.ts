import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/db/schema.ts',
	dbCredentials: {
		host: process.env.DB_HOST!,
		port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
		user: process.env.DB_USER!,
		password: process.env.DB_PASSWORD!,
		database: process.env.DB_NAME!,
		ssl: {
			rejectUnauthorized: false,
		},
	},
});
