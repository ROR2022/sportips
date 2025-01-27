import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/Footer/Footer";



export const metadata: Metadata = {
  title: "First App Innovare",
  description: "First App Innovare",
};

async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-white dark:bg-black min-h-dvh`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Navbar />
            <div style={{ height: "80vh" }}>
            {children}
            </div>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
