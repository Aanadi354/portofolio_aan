import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ["site_title", "site_description", "site_keywords"] } },
  });
  const values = Object.fromEntries(settings.map((setting) => [setting.key, setting.value ?? ""]));

  return {
    title: values.site_title || "Personal Portfolio",
    description: values.site_description || "A portfolio of selected projects, skills, and experience.",
    keywords: values.site_keywords ? values.site_keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean) : undefined,
    icons: { icon: "/api/site-icon" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
