'use client';

import React, { useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

type Props = {
	children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
	const [client] = useState(new QueryClient());

	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default Providers;
