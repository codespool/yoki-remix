import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { fetchAPI, getStrapiMedia, getStrapiURL } from "@/lib/fetch-api";
import { FALLBACK_SEO } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

interface Global {
  data: {
    metadata: {
      metaTitle: string;
      metaDescription: string;
    };
    favicon: {
      url: string;
    };
    footer: {
      copyright: string;
      legalLinks: LegalLink[];
      socialLinks: SocialLink[];
    };
  };
}

export type LegalLink = {
  text: string;
  url: string;
  newTab: boolean;
};

export type SocialLink = {
  text: string;
  url: string;
  newTab: boolean;
  type: "twitter" | "discord" | "telegram" | "medium" | "youtube" | "github";
};

async function getGlobal(lang: string): Promise<Global> {
  const path = "/global";
  const urlParams = {
    populate: [
      "metadata",
      "favicon",
      "footer.legalLinks",
      "footer.socialLinks",
      "footer.copyright",
    ],
    locale: lang,
  };
  return await fetchAPI(path, urlParams);
}

export async function generateMetadata({
  params,
}: { params: { lang: string } }): Promise<Metadata> {
  const meta = await getGlobal(params.lang);
  if (!meta.data) return FALLBACK_SEO;
  const { metadata, favicon } = meta.data;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
    icons: {
      icon: [new URL(favicon.url, getStrapiURL())],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const global = await getGlobal(params.lang);
  if (!global.data) return null;

  return (
    <html lang={params.lang} className={inter.className}>
      <body>
        <main className="flex flex-col h-screen">
          <Header />
          <div className="flex-grow">{children}</div>
          <Footer {...global.data.footer} />
        </main>
      </body>
    </html>
  );
}
