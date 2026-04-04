import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PredictFlow — AI-Powered Predictive Analytics',
  description: 'Upload CSV data, train ML models, and forecast the future. Time series, classification, and regression — all in one dashboard.',
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
