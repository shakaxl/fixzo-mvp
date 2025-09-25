import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}