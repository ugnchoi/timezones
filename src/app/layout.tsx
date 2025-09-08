import './globals.css';
import { QueryProvider } from '@/components/query-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Montserrat, Fira_Code } from 'next/font/google';
import type { Metadata } from 'next';

const sans = Montserrat({ subsets: ['latin'], variable: '--font-sans' });
const mono = Fira_Code({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: "Timezones - World Clock & Weather",
  description: "Real-time weather and time across major cities",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">
                {children}
              </div>
              <footer className="py-6 text-center">
                <p className="text-xs text-muted-foreground/60">
                  Vibe coded by Yoojin C.
                </p>
              </footer>
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
