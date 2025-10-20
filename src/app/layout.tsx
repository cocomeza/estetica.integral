import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RecaptchaProvider from "../components/RecaptchaProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 📱 MEJORA #12: Metadata mejorada con PWA
export const metadata: Metadata = {
  title: "Estética Integral - Lorena Esquivel",
  description: "Sistema de reserva de turnos para Centro de Estética Integral",
  manifest: "/manifest.json",
  themeColor: "#a6566c",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Estética Integral",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Estética Integral",
    title: "Estética Integral - Lorena Esquivel",
    description: "Reserva tu turno para tratamientos estéticos",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RecaptchaProvider>
          {children}
        </RecaptchaProvider>
      </body>
    </html>
  );
}
