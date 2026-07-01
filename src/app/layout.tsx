import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display, Inter, Lora } from 'next/font/google';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-gm-sans',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-serif',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-lora',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.crestviewacademy.edu.ng'),

  title: {
    default: 'Crestview Academy | Raising Excellence, Shaping Futures',
    template: '%s | Crestview Academy',
  },

  description:
    'Crestview Academy is a leading private school in Lagos, Nigeria, offering world-class education from Nursery through Secondary. We nurture academic excellence, character, and leadership in every child.',

  keywords: [
    'private school Lagos',
    'best school Lekki',
    'nursery school Lagos',
    'primary school Lagos',
    'secondary school Lagos',
    'international school Nigeria',
    'top schools in Lagos',
    'private school Nigeria',
    'best secondary school Lagos',
    'Crestview Academy Lagos',
    'Lekki private school',
    'boarding school Nigeria',
    'A-level school Nigeria',
    'WAEC school Lagos',
    'school admissions Lagos',
  ],

  openGraph: {
    type: 'website',
    siteName: 'Crestview Academy',
    locale: 'en_NG',
    url: 'https://www.crestviewacademy.edu.ng',
    title: 'Crestview Academy | Raising Excellence, Shaping Futures',
    description:
      'A premier private school in Lekki, Lagos offering Nursery, Primary, and Secondary education. Enrol your child in an environment built for academic excellence and character development.',
    images: [
      {
        url: '/og/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Crestview Academy — Premier Private School in Lagos, Nigeria',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Crestview Academy | Raising Excellence, Shaping Futures',
    description:
      'Enrol your child at Crestview Academy — a leading private school in Lagos offering Nursery, Primary, and Secondary education built on excellence and strong values.',
    images: ['/og/og-home.jpg'],
  },

  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/apple-touch-icon.png', rel: 'apple-touch-icon' },
      { url: '/android-chrome-192x192.png', rel: 'android-chrome-192x192' },
      { url: '/android-chrome-512x512.png', rel: 'android-chrome-512x512' },
    ],
  },

  manifest: '/site.webmanifest',

  alternates: {
    canonical: 'https://www.crestviewacademy.edu.ng',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} 
        ${dmSans.variable} 
        ${dmSerif.variable} 
        ${lora.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster closeButton position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
