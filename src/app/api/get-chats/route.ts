import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const POST = async (req: Request, res: Response) => {
	try {
		const { userId } = await req.json();
		const _chats = await db
			.select()
			.from(chats)
			.where(eq(chats.userId, userId));
		// const curChat = _chats.find((c) => c.id === parseInt(chatId));

		// if (!curChat || _chats.length === 0) {
		// 	throw new Error(`${_chats[0]?.id}`, {
		// 		cause: 'Current chat not found',
		// 	});
		// }

		if (_chats.length === 0) {
			return NextResponse.json({ error: 'No chats found' }, { status: 400 });
		}

		return NextResponse.json({ chats: _chats });
	} catch (error: any) {
		return NextResponse.json(
			// { error: error.cause, latestChat: parseInt(error.message) },
			{ error: 'Internal Server Error' },
			{ status: 400 }
		);
	}
};
