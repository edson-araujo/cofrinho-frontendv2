import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/context/LoadingContext";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Porquinho - Controle de finanças",
  description: "Sistema de controle de finanças pessoais",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-32x32.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  openGraph: {
    title: "Cofrinho",
    description: "Uma aplicação para controle de finanças pessoais.",
    type: "website",
    url: "https://localhost:3000",
    images: [
      {
        url: "https://localhost:3000/imagem.png",
        width: 1200,
        height: 630,
        alt: "Imagem de Cofrinho",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ToastProvider>
          <LoadingProvider>{children}</LoadingProvider>
        </ToastProvider>
        <Toaster />
      </body>
    </html>
  );
}
