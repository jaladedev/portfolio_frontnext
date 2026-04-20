import { Playfair_Display, DM_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jaladedev.com";
const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME?.trim() || "Ayodeji Alalade";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${ownerName} — Full Stack Developer`,
    template: "%s | JaladeDev",
  },
  description:
    "Full Stack Developer specializing in Laravel & React. I build scalable REST APIs and modern frontend applications. Available for freelance work.",
  keywords: [
    "Full Stack Developer",
    "Laravel Developer",
    "React Developer",
    "PHP Developer",
    "Next.js",
    "Nigeria",
    "Freelance Developer",
    "Web Development",
    "REST API",
    "JaladeDev",
  ],
  authors: [{ name: ownerName, url: siteUrl }],
  creator: ownerName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "JaladeDev",
    title: `${ownerName} — Full Stack Developer`,
    description:
      "Full Stack Developer specializing in Laravel & React. Building scalable APIs and modern web experiences.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `JaladeDev — ${ownerName} Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${ownerName} — Full Stack Developer`,
    description:
      "Full Stack Developer specializing in Laravel & React. Building scalable APIs and modern web experiences.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@jaladedev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: ownerName,
  url: siteUrl,
  jobTitle: "Full Stack Developer",
  description:
    "Full Stack Developer specializing in Laravel and React, building scalable APIs and modern web applications.",
  knowsAbout: ["Laravel", "PHP", "React", "Next.js", "REST API", "MySQL", "TailwindCSS"],
  sameAs: [
    "https://github.com/jaladedev",
    "https://linkedin.com/in/jaladedev",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "NG",
    addressLocality: "Lagos",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${dmMono.variable} ${jakarta.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="bg-ink-900 text-cream-100 font-sans antialiased">
        <PageLoader />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}