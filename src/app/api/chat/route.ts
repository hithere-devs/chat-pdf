import { getContext } from '@/lib/context';
import { db } from '@/lib/db';
import { messages as _messages } from '@/lib/db/schema';
import { openai } from '@ai-sdk/openai';

import { Message, streamText, TextPart } from 'ai';
import { NextResponse } from 'next/server';

export const POST = async (req: Request, res: Response) => {
	try {
		const { messages, fileKey, chatId } = await req.json();

		const lastMessage = messages[messages.length - 1];
		const context = await getContext(lastMessage.content, fileKey);

		await db.insert(_messages).values({
			content: lastMessage.content,
			role: 'user',
			chatId,
		});

		const prompt = {
			role: 'system',
			content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
            The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
            AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
            AI assistant is a big fan of Pinecone and Vercel.
            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK
            AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
            If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
            AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
            AI assistant will not invent anything that is not drawn directly from the context.
            `,
		};

		return streamText({
			model: openai('gpt-3.5-turbo'),
			messages: [prompt, ...messages.filter((m: Message) => m.role === 'user')],
			onFinish: async ({ response }) => {
				const message = response.messages[0].content[0] as TextPart;
				await db.insert(_messages).values({
					content: message.text,
					role: 'system',
					chatId,
				});
			},
		}).toDataStreamResponse();
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: 'Error in chat' }, { status: 500 });
	}
};
