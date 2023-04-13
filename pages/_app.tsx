import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';

import type { AppProps } from 'next/app';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${inter.variable} font-sans`}>
      <ThemeProvider attribute='class' defaultTheme='system'>
        <Component {...pageProps} />
        <Analytics />
      </ThemeProvider>
    </main>
  );
}
