'use client';

import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Search = () => {
	return (
		<div className='h-[92vh] flex flex-col items-center justify-center p-4'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='text-center space-y-4'
			>
				<div className='flex justify-center'>
					<SearchIcon className='h-12 w-12 text-muted-foreground' />
				</div>
				<h1 className='text-2xl font-semibold'>Search Coming Soon</h1>
				<p className='text-muted-foreground max-w-md mx-auto'>
					We're working on an awesome search feature that will let you find
					conversations across all your documents. Stay tuned!
				</p>
				<p className='text-sm text-muted-foreground'>
					Currently in beta • Release expected soon
				</p>
			</motion.div>
		</div>
	);
};

export default Search;
