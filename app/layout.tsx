import QueryProvider from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
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
            <html
                lang='fr'
                className='dark'
                style={{ colorScheme: 'dark' }}
                suppressHydrationWarning
            >
                <body className={inter.className}>
                    <QueryProvider>
                        <ThemeProvider
                            attribute='class'
                            defaultTheme='system'
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                        </ThemeProvider>
                        <Toaster richColors position='bottom-right' />
                    </QueryProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
