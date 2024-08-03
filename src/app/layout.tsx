import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootStyleRegistry } from "@/components/RootStyleRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scheduling App",
  description: "A scheduling app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ inter.className }>
        <main className="flex min-h-screen flex-col">
          <RootStyleRegistry>{children}</RootStyleRegistry>
        </main>
      </body>
    </html>
  );
}
