import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Providers from '@/components/provider';
import { Toaster } from 'react-hot-toast';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	// title: 'Chat PDF',
	// description: 'An app to talk to your pdf with the magic of AI',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<Providers>
				<html lang='en'>
					<head>
						<title>Doc Assist - by hit here devs!</title>
						<meta
							name='description'
							content='Silent pages to active chats -  talk to your pdf with the magic of AI, empowering students, researchers, developers and professionals to explore ideas, answer questions, and uncover insights using advanced AI.'
						/>

						<link rel='icon' href='/favicon.ico' />

						<meta
							property='og:url'
							content='https://doc-assist.hitheredevs.com'
						/>
						<meta property='og:type' content='website' />
						<meta
							property='og:title'
							content='Doc Assist - by hit here devs!'
						/>
						<meta
							property='og:description'
							content='Silent pages to active chats -  talk to your pdf with the magic of AI, empowering students, researchers, developers and professionals to explore ideas, answer questions, and uncover insights using advanced AI.'
						/>
						<meta
							property='og:image'
							content='https://res.cloudinary.com/chintukepapa/image/upload/v1733495066/apak47cxwfwtymvfno8n.png'
						/>

						<meta name='twitter:card' content='summary_large_image' />
						<meta
							property='twitter:domain'
							content='doc-assist.hitheredevs.com'
						/>
						<meta
							property='twitter:url'
							content='https://doc-assist.hitheredevs.com'
						/>
						<meta
							name='twitter:title'
							content='Doc Assist - by hit here devs!'
						/>
						<meta
							name='twitter:description'
							content='Silent pages to active chats -  talk to your pdf with the magic of AI, empowering students, researchers, developers and professionals to explore ideas, answer questions, and uncover insights using advanced AI.'
						/>
						<meta
							name='twitter:image'
							content='https://res.cloudinary.com/chintukepapa/image/upload/v1733495066/apak47cxwfwtymvfno8n.png'
						/>
					</head>
					<body
						className={`${geistSans.variable} ${geistMono.variable} antialiased`}
						suppressHydrationWarning
					>
						{children}
						<Toaster />
					</body>
				</html>
			</Providers>
		</ClerkProvider>
	);
}
