import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/providers/Providers";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // title: "NextMart",
  title: "BasaFinder",
  description: "Smar Rentals , Smarter Living",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Toaster richColors position="top-center" />
            {/* {children} */}
            <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
