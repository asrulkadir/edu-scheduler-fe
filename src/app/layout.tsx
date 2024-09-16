import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RootStyleRegistry } from '@/components/RootStyleRegistry';
import SwrProvider from './swrProvider';
import ContextProvider from '@/context/ContextProvider';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Scheduling App',
  description: 'A scheduling app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader />
        <main className="flex min-h-screen flex-col">
          <SwrProvider>
            <RootStyleRegistry>
              <ContextProvider>{children}</ContextProvider>
            </RootStyleRegistry>
          </SwrProvider>
        </main>
      </body>
    </html>
  );
}
