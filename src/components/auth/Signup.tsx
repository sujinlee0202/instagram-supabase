"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { Dispatch, SetStateAction, useState } from "react";
import { FloatLabelInput } from "../common/FloatLabelInput";
import { Button } from "../ui/button";

interface Props {
  setView: Dispatch<SetStateAction<string>>;
}

export default function SignUp({ setView }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const supabase = createBrowserSupabaseClient();

  return (
    <div className="flex flex-col gap-4">
      <div className="pt-10 pb-6 px-10 w-full flex flex-col items-center justify-center max-w-xl border border-gray-400 bg-white gap-2">
        {/** Logo */}
        <p className="text-2xl font-bold mb-6 ">INFLEARNGRAM</p>

        {/** Input Field */}
        <div className="flex flex-col gap-4">
          <FloatLabelInput id="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FloatLabelInput id="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="h-10 rounded-md text-sm bg-blue-500 font-bold">가입하기</Button>
        </div>
      </div>

      {/** Go to Login */}
      <div className="py-4 w-full text-center max-w-lg border border-gray-400 bg-white text-sm">
        이미 계정이 있으신가요?{" "}
        <button className="text-blue-500 font-bold" onClick={() => setView("SIGNIN")}>
          로그인하기
        </button>
      </div>
    </div>
  );
}
