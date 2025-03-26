"use client";

import React from "react";
import Person from "./Person";
import Message from "./Message";
import useChatStore from "@/store/useChatStore";

export default function ChatScreen() {
  const [message, setMessage] = React.useState("");
  const selectedIndex = useChatStore((state) => state.selectedIndex);

  return selectedIndex ? (
    <div className="w-full h-screen flex flex-col">
      {/** User */}
      <Person index={0} isActived={false} name="sujin" onChatScreen={true} onlineAt={new Date().toISOString()} userId="sujin" onClick={() => {}} />

      {/** Chat Field */}
      <div className="w-full overflow-y-scroll flex-1 flex flex-col p-4 gap-3">
        <Message message="hello, 안녕하세요" isFromMe={false} />
        <Message message="hello, 안녕하세요" isFromMe={true} />
      </div>

      {/** Input Field */}
      <div className="flex">
        <input value={message} onChange={(e) => setMessage(e.target.value)} className="p-3 w-full border-2 border-blue-400" placeholder="메시지를 입력하세요." />

        <button onClick={() => {}} className="min-w-20 p-3 bg-blue-400 text-white" color="light-blue">
          전송
        </button>
      </div>
    </div>
  ) : (
    <div className="w-full"></div>
  );
}
