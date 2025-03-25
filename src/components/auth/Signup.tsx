"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { Dispatch, SetStateAction, useState } from "react";
import { FloatLabelInput } from "../common/FloatLabelInput";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";

interface Props {
  setView: Dispatch<SetStateAction<string>>;
}

export default function SignUp({ setView }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  const supabase = createBrowserSupabaseClient();

  //signup mutation
  const { mutate: signupMutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:3000/signup/confirm",
        },
      });

      if (data) {
        setConfirmationRequired(true);
      }

      if (error) {
        alert(error.message);
      }
    },
  });

  //otp signup mutation
  const { mutate: signupOTPMutate, isPending: otpIsPending } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.verifyOtp({
        type: "signup",
        email,
        token: otp,
      });

      if (data) {
        setConfirmationRequired(true);
      }

      if (error) {
        alert(error.message);
      }
    },
  });

  const handleSignup = () => {
    if (confirmationRequired) {
      signupOTPMutate();
    } else {
      signupMutate();
    }
  };

  // TODO : 로딩 중 Backdrop 추가
  // TODO : 회원가입 완료 후 input state 초기화

  return (
    <div className='flex flex-col gap-4'>
      <div className='pt-10 pb-6 px-10 w-full flex flex-col items-center justify-center max-w-xl border border-gray-400 bg-white gap-2'>
        {/** Logo */}
        <p className='text-2xl font-bold mb-6 '>INFLEARNGRAM</p>

        {/** Input Field */}
        <div className='flex flex-col gap-4'>
          {confirmationRequired ? (
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          ) : (
            <>
              <FloatLabelInput
                id='email'
                label='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FloatLabelInput
                id='password'
                label='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
          <Button
            className='h-10 rounded-md text-sm bg-blue-500 font-bold'
            onClick={handleSignup}
          >
            {confirmationRequired
              ? otpIsPending
                ? "Loading..."
                : "확인"
              : isPending
              ? "Loading..."
              : "회원가입"}
          </Button>
        </div>
      </div>

      {/** Go to Login */}
      <div className='py-4 w-full text-center max-w-lg border border-gray-400 bg-white text-sm'>
        이미 계정이 있으신가요?{" "}
        <button
          className='text-blue-500 font-bold'
          onClick={() => setView("SIGNIN")}
        >
          로그인하기
        </button>
      </div>
    </div>
  );
}
