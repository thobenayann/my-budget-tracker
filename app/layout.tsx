import RootProviders from '@/components/providers/RootProviders';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'My Budget Tracker',
    description: 'An app to track your budget',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang='fr' className='dark' style={{ colorScheme: 'dark' }}>
                <body className={inter.className}>
                    <RootProviders>{children}</RootProviders>
                </body>
            </html>
        </ClerkProvider>
    );
}
