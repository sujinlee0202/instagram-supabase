import LogoutButton from "@/components/auth/LogoutButton";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Inflearngram",
  description: "Instagram clone project",
};

export default async function MainPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className='w-full h-screen flex flex-col gap-2 items-center justify-center'>
      <h1 className='font-bold text-xl'>
        Welcome {session?.user?.email?.split("@")?.[0]}!
      </h1>
      <LogoutButton classname='border border-red-500 bg-white text-red-500 hover:bg-red-500 hover:text-white'>
        로그아웃
      </LogoutButton>
    </div>
  );
}
