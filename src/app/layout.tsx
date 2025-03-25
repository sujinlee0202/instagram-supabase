import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/config/ReactQueryProvider";
import MainLayout from "./(main)/layout";
import Auth from "@/components/auth";

export const metadata: Metadata = {
  title: "Supabase Instagram",
  description: "Supabase Instagram App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLogin = false;
  return (
    <html lang="en">
      <head></head>
      <body>
        <ReactQueryProvider>{isLogin ? <MainLayout>{children}</MainLayout> : <Auth />}</ReactQueryProvider>
      </body>
    </html>
  );
}
