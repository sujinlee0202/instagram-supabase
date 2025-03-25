"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";

export default function LogoutButton({ classname, children }: { children: React.ReactNode; classname?: string }) {
  const supabase = createBrowserSupabaseClient();

  return (
    <Button className={twMerge(classname)} onClick={async () => supabase.auth.signOut()}>
      {children}
    </Button>
  );
}
