import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Red_Hat_Display } from "next/font/google";

const font = Red_Hat_Display({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Job CRM",
  description: "Employees create jobs. The sales team reviews them.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
