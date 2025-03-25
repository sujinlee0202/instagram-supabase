"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Home, LogOut, Search, Send, UserRound } from "lucide-react";
import LogoutButton from "./auth/LogoutButton";

export default function Sidebar() {
  const supabase = createBrowserSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="w-fit h-screen p-6 border-r border-gray-300 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <Link href="/">
          <Home className="text-2xl mb-10" />
        </Link>
        <Link href="/people">
          <UserRound className="text-2xl" />
        </Link>
        <Link href="/discover">
          <Search className="text-2xl" />
        </Link>
        <Link href="/chat">
          <Send className="text-2xl" />
        </Link>
      </div>

      {/* Logout Button */}
      <div>
        <LogoutButton>
          <LogOut className="text-2xl text-deep-purple-900" />
        </LogoutButton>
      </div>
    </aside>
  );
}
