import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export const POST = async (req: Request, res: Response) => {
	try {
		const { userId, chatId } = await req.json();
		console.log(userId, chatId);
		const chat = await db
			.select()
			.from(chats)
			.where(and(eq(chats.userId, userId), eq(chats.id, chatId)));

		if (chat.length === 0) {
			const latestChat = await db
				.select()
				.from(chats)
				.limit(1)
				.where(eq(chats.userId, userId))
				.orderBy(desc(chats.createdAt));

			return NextResponse.json(
				{ error: 'No chats found', nextChatId: latestChat[0].id },
				{ status: 400 }
			);
		}

		return NextResponse.json({ chat: chat[0] });
	} catch (error: any) {
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
};
