import type { ReactNode } from "react";
import type { Metadata } from "next";

import { SiteProviders } from "@/components/providers/SiteProviders";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Maison Elite",
  description:
    "An ultra-premium restaurant website with editorial storytelling, WhatsApp ordering, and a private admin dashboard."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}
