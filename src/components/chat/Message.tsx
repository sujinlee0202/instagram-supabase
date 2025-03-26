"use client";

interface Props {
  isFromMe: boolean;
  message: string;
}

export default function Message({ isFromMe, message }: Props) {
  return (
    <div className={`w-fit p-3 rounded-md ${isFromMe ? "ml-auto bg-blue-400 text-white" : "bg-gray-100 text-black"}`}>
      <p>{message}</p>
    </div>
  );
}
