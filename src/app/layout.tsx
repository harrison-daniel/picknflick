import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import DarkIcon from '@/images/dark/logo-dark.png';
import LightIcon from '@/images/light/logo-light.png';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PicknFlick',
  description: 'Random Decision Picker',
  // icons: [
  //   {
  //     rel: 'icon',
  //     type: 'image/png',
  //     sizes: '32x32',
  //     url: '/images/favicon-32x32.png',
  //   },
  //   {
  //     rel: 'icon',
  //     type: 'image/png',
  //     sizes: '16x16',
  //     url: '/images/favicon-16x16.png',
  //   },
  //   {
  //     rel: 'apple-touch-icon',
  //     sizes: '180x180',
  //     url: '/images/apple-touch-icon.png',
  //   },
  // ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
