import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ToastProvider';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Suri Learning - Học Tiếng Anh Thông Minh',
  description: 'Ứng dụng học tiếng Anh IELTS với AI, gamification và SRS',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
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
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
