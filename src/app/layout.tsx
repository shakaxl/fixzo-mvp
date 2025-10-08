import type { Metadata } from "next";
import Script from 'next/script';
import "./globals.css";

export const metadata: Metadata = {
  title: "FIXZO - Soporte Técnico Rápido y Confiable",
  description: "Conéctate con técnicos expertos en tu zona para resolver tus problemas informáticos. Sin esperas, sin complicaciones, con garantía total.",
  keywords: "soporte técnico, reparación computadoras, técnicos Lima, FIXZO",
  authors: [{ name: "FIXZO" }],
  openGraph: {
    title: "FIXZO - Soporte Técnico a Solo un Clic",
    description: "Resuelve tus problemas técnicos con expertos verificados cerca de ti",
    url: "https://fixzo.app",
    siteName: "FIXZO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIXZO - Soporte Técnico Profesional",
    description: "Conecta con técnicos expertos para resolver problemas informáticos",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L5QTMP9WG8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L5QTMP9WG8');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}