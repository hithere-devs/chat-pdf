import AWS from 'aws-sdk';
import { Key } from 'lucide-react';

export async function uploadToS3(file: File) {
	try {
		AWS.config.update({
			accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
			secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
		});

		const s3 = new AWS.S3({
			params: {
				Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
			},
			region: process.env.NEXT_PUBLIC_S3_REGION,
		});

		const file_key =
			'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

		const params = {
			Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
			Key: file_key,
			Body: file,
		};

		const upload = s3
			.putObject(params)
			.on('httpUploadProgress', (evt) => {
				// console.log(
				// 	'uploading to s3...',
				// 	parseInt(((evt.loaded / evt.total) * 100).toString()) + '%'
				// );
			})
			.promise();

		await upload.then((data) => {
			// console.log('successfully uploaded to s3', file_key);
		});

		return Promise.resolve({
			file_key: file_key,
			file_name: file.name,
		});
	} catch (error) {
		console.log(error);
	}
}

export function getS3URL(file_key: string) {
	return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${file_key}`;
}
