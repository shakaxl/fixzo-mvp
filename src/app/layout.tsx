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
        {/* Meta Pixel */}
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1462958004777902');
        fbq('track', 'PageView');
      `}
    </Script>
    <noscript>
      <img 
        height="1" 
        width="1" 
        style={{display: 'none'}}
        src="https://www.facebook.com/tr?id=1462958004777902&ev=PageView&noscript=1"
        alt=""
      />
    </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}