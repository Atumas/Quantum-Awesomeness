import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Toaster from '@/components/Toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AppForge AI 2.0 - From Idea to App in 60 Seconds',
  description: 'AI-native app development platform with instant preview and multi-platform deployment',
  keywords: ['ai', 'app development', 'code generation', 'vercel', 'nextjs', 'deployment'],
  openGraph: {
    title: 'AppForge AI 2.0',
    description: 'Surprise the world with AI-powered app creation',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AppForge AI',
    description: 'AI-native app development platform',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
