import Provider from "@/components/Provider/MainProvider";
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

// ✅ Configure Onest font
const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Distribution Management System",
  description:"Distribution Management System for Efficient Supply Chain Operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${onest.variable} antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
