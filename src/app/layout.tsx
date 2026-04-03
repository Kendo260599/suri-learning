import type { Metadata, Viewport } from 'next';
import { ToastProvider } from '@/components/ToastProvider';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import '@/app/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ff4b4b',
};

export const metadata: Metadata = {
  title: 'Suri Learning - Học Tiếng Anh Thông Minh',
  description: 'Ứng dụng học tiếng Anh IELTS với AI, gamification và SRS',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Suri Learning',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: '/icons/icon-192.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <ServiceWorkerRegistration />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
