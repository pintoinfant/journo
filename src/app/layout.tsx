import { auth } from "@/auth";
import ClientProviders from "@/providers";
import "@worldcoin/mini-apps-ui-kit-react/styles.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { NavTabbar } from "@/components/nav-tabbar"
import { Suspense } from "react"


const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Journo - Share rides. Share homes. Share trust",
  description:
    "Trusted travel community for hosting and ridesharing with World ID verified humans.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${dmSans.className} bg-black`}>
        <ClientProviders session={session}>
          <div aria-hidden className="bg-grid" />
          <Suspense fallback={null}>{children}</Suspense>

        </ClientProviders>
      </body>
    </html>
  );
}
