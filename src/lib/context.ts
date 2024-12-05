import { Pinecone } from '@pinecone-database/pinecone';
import { convertToAscii } from './utils';
import { getEmbeddings } from './embeddings';

export async function getMatchesFromEmbeddings(
	embeddings: number[],
	fileKey: string
) {
	const pinecone = new Pinecone({
		apiKey: process.env.PINECONE_API_KEY!,
	});

	try {
		const namespace = convertToAscii(fileKey);
		const pineconeIndex = await pinecone
			.Index('hithere-chatpdf')
			.namespace(namespace);
		const queryResult = await pineconeIndex.query({
			topK: 5,
			vector: embeddings,
			includeMetadata: true,
		});

		return queryResult.matches || [];
	} catch (error) {
		console.log('error calling pinecone embeddings api', error);
		throw error;
	}
}

export async function getContext(query: string, fileKey: string) {
	const queryEmbeddings = await getEmbeddings(query);
	const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

	const qualifyingDocs = matches.filter(
		(match) => match.score && match.score > 0.7
	);

	type Metadata = {
		text: string;
		pageNumber: number;
	};

	let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
	return docs.join('\n').substring(0, 3000);
}
