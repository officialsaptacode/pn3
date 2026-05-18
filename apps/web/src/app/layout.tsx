import type React from "react";
import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import Navbar from "../components/navbar";

export const metadata: Metadata = {
  title: "pn3 Boilerplate",
  description: "High-performance monorepo boilerplate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
