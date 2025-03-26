import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/config/ReactQueryProvider";
import MainLayout from "./(main)/layout";
import Auth from "@/components/auth";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import AuthProvider from "@/config/AuthProvider";

export const metadata: Metadata = {
  title: "Supabase Instagram",
  description: "Supabase Instagram App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getSession();
  const isLogin = data.session?.user;

  return (
    <html lang='en'>
      <head></head>
      <body>
        <ReactQueryProvider>
          <AuthProvider accessToken={data.session?.access_token}>
            {isLogin ? children : <Auth />}
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
