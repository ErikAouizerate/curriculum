import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Suspense } from "react";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CV Érik Aouizerate",
  description:
    "Site personnel de Erik Aouizerate. curriculum intéractif. Contact pour mission freelance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <script
          defer
          src="https://umami.mintset.net/script.js"
          data-website-id="88fabec3-3193-480e-956d-00007448df18"
        ></script>
      </Head>
      <body className={inter.className}>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
