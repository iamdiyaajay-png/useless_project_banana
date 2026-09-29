import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GovernmentHeader } from '@/components/ui/GovernmentHeader';
import { Sidebar } from '@/components/ui/Sidebar';
import { MobileBottomNav } from '@/components/ui/MobileBottomNav';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A2F5C',
};

export const metadata: Metadata = {
  title: 'Pazamayi Sheriyayi - National Banana Registry',
  description: 'Official Government Portal for the Registration, Analysis, and Verification of Bananas.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>
        <div className="app-shell">
          <GovernmentHeader />
          <div className="app-body">
            <Sidebar />
            <main className="app-main">
              {children}
            </main>
          </div>
          <MobileBottomNav />
        </div>
      </body>
    </html>
  );
}
