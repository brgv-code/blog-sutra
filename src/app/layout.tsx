import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ApolloProviderWrapper } from "../lib/apollo/client";
import { ToastProvider } from "@/ui/toast";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Sutra - Professional Note-Taking Platform",
    template: "%s | Sutra",
  },
  description:
    "The most advanced note-taking platform with AI assistance, multi-tenant support, and beautiful themes. Perfect for individuals and teams.",
  keywords: [
    "notes",
    "markdown",
    "obsidian",
    "collaboration",
    "ai",
    "productivity",
    "knowledge management",
  ],
  authors: [{ name: "Sutra Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sutra",
    title: "Sutra - Professional Note-Taking Platform",
    description:
      "The most advanced note-taking platform with AI assistance and collaboration features.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sutra",
    description: "Professional note-taking platform for modern teams",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
        <ToastProvider />
      </body>
    </html>
  );
}
