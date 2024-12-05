import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import {
	Document,
	RecursiveCharacterTextSplitter,
} from '@pinecone-database/doc-splitter';
import { downloadFromS3 } from './s3-server';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { getEmbeddings } from './embeddings';
import md5 from 'md5';
// import { Vector } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data';
import { chunks, convertToAscii } from './utils';

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
	if (!pinecone) {
		pinecone = new Pinecone({
			apiKey: process.env.PINECONE_API_KEY!,
		});
	}
	return pinecone;
};

type PDFPage = {
	pageContent: string;
	metadata: {
		loc: { pageNumber: number };
	};
};

export const truncateStringByBites = (str: string, bytes: number) => {
	const encoder = new TextEncoder();
	return new TextDecoder('utf-8').decode(encoder.encode(str).slice(0, bytes));
};

async function prepareDoc(page: PDFPage) {
	let { pageContent, metadata } = page;
	pageContent = pageContent.replace(/\n/g, '');
	// split the document
	const splitter = new RecursiveCharacterTextSplitter();
	const docs = splitter.splitDocuments([
		new Document({
			pageContent,
			metadata: {
				pageNumber: metadata.loc.pageNumber,
				text: truncateStringByBites(pageContent, 36000),
			},
		}),
	]);
	return docs;
}

async function embedDoc(doc: Document) {
	try {
		const embeddings = await getEmbeddings(doc.pageContent);
		const hash = md5(doc.pageContent);

		return {
			id: hash,
			values: embeddings,
			metadata: {
				text: doc.metadata.text,
				pageNumber: doc.metadata.pageNumber,
			},
		} as PineconeRecord;
	} catch (error) {
		console.log('error embedding doc', error);
		throw error;
	}
}

export async function loadS3IntoPinecone(fileKey: string) {
	// download and read from pdf
	console.log('downloading pdf into file system');
	const file_name = await downloadFromS3(fileKey);
	if (!file_name) {
		throw new Error('Failed to download file from S3');
	}
	const loader = new PDFLoader(file_name);
	const pages = (await loader.load()) as PDFPage[];

	// prepare the document
	const documents = await Promise.all(pages.map(prepareDoc));

	// vectorize and embed the individual document
	const vectors = await Promise.all(documents.flat().map(embedDoc));

	// upload to pinecone
	const client = await getPineconeClient();
	const namespace = convertToAscii(fileKey);
	const pineconeIndex = client.Index('hithere-chatpdf').namespace(namespace);

	console.log('inserting vectors into pinecone');
	const vectorChunks = chunks(vectors, 10);
	Promise.all(vectorChunks.map((chunk) => pineconeIndex.upsert(chunk)));

	return documents[0];
}
