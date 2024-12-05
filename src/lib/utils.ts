import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const convertToAscii = (str: string) => {
	// remove any non-ascii characters
	return str.replace(/[^\x00-\x7F]/g, '');
};

// A helper function that breaks an array into chunks of size batchSize
export const chunks = (array: any, batchSize = 10) => {
	const chunks = [];

	for (let i = 0; i < array.length; i += batchSize) {
		chunks.push(array.slice(i, i + batchSize));
	}

	return chunks;
};
