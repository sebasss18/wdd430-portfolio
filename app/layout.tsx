import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const siteUrl = "https://sebsss18portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sebastian Bernal | Project Portfolio",
    template: "%s | Sebastian Bernal",
  },
  description:
    "Explore Sebastian Bernal's web development portfolio, featuring school and open-source projects built with modern web technologies.",
  alternates: { canonical: "/" },
  verification: { google: "BIxXKhdQTuV2Po11cd_o_HuRzsoXN14lu0eMEluQwyw" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Sebastian Bernal Portfolio",
    title: "Sebastian Bernal | Project Portfolio",
    description:
      "Web development portfolio featuring school and open-source projects.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sebastian Bernal | Project Portfolio",
    description:
      "Web development portfolio featuring school and open-source projects.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sebastian Bernal",
  url: siteUrl,
  jobTitle: "Full stack Web Developer",
  sameAs: ["https://github.com/sebasss18"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
