import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const POST = async (req: Request, res: Response) => {
	const { userId, chatId } = await req.json();
	const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
	const curChat = _chats.find((c) => c.id === parseInt(chatId));

	return NextResponse.json({ chats: _chats, curChat });
};
