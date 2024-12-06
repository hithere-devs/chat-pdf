import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const POST = async (req: Request, res: Response) => {
	try {
		const { userId, chatId } = await req.json();
		const _chats = await db
			.select()
			.from(chats)
			.where(eq(chats.userId, userId));
		const curChat = _chats.find((c) => c.id === parseInt(chatId));

		if (!curChat || _chats.length === 0) {
			throw new Error(`${_chats[0]?.id}`, {
				cause: 'Current chat not found',
			});
		}

		return NextResponse.json({ chats: _chats, curChat });
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.cause, latestChat: parseInt(error.message) },
			{ status: 400 }
		);
	}
};
