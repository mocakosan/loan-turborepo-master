import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryClientWrapper from "./query-client-wrapper";
import { Toaster } from "@/components/ui/sonner";
import AdminSessionWrapper from "./admin-session-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "추천대출 관리자",
  description: "추천대출 관리자",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientWrapper>
          <AdminSessionWrapper>{children}</AdminSessionWrapper>
        </QueryClientWrapper>
        <Toaster
          position={"bottom-center"}
          toastOptions={{
            className: "bg-white border-none shadow-md text-blue-950",
          }}
        />
      </body>
    </html>
  );
}
