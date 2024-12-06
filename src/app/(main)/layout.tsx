import { MainLayoutComp } from '@/components/main-layout';

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <MainLayoutComp>{children}</MainLayoutComp>;
}
