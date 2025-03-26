"use client";

import React from "react";
import Person from "./Person";
import Message from "./Message";
import useChatStore from "@/store/useChatStore";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/actions/chatActions";

export default function ChatScreen() {
  const [message, setMessage] = React.useState("");
  const selectedIndexState = useChatStore((state) => state.selectedIndexState);
  const selectedUserIndex = useChatStore((state) => state.selectedUserIndex);
  const { data, error, isLoading } = useQuery({
    queryKey: ["user", selectedIndexState],
    queryFn: async () => {
      const user = await getUserById(selectedIndexState);
      return user;
    },
  });

  console.log("data", selectedIndexState);

  return selectedIndexState !== "0" ? (
    <div className="w-full h-screen flex flex-col">
      {/** User */}
      <Person
        index={selectedUserIndex}
        isActived={selectedIndexState === data?.id}
        name={data?.email?.split("@")[0] ?? ""}
        onChatScreen={false}
        onlineAt={new Date().toISOString()}
        userId={data?.id ?? ""}
      />

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
