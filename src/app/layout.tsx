import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://predictive-analytics-v2.vercel.app'),
  title: {
    default: 'PredictFlow — ML-Powered Predictive Analytics',
    template: '%s | PredictFlow',
  },
  description:
    'Time-series forecasting, anomaly detection, and trend analysis powered by machine learning.',
  keywords: [
    'predictive analytics',
    'forecasting',
    'ML',
    'anomaly detection',
    'time series',
  ],
  openGraph: {
    title: 'PredictFlow — ML-Powered Predictive Analytics',
    description: 'Time-series forecasting, anomaly detection.',
    type: 'website',
    url: 'https://predictive-analytics-v2.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PredictFlow',
    description: 'ML-powered forecasting.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
