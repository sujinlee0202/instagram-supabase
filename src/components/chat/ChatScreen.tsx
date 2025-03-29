"use client";

import React, { useEffect, useRef } from "react";
import Person from "./Person";
import Message from "./Message";
import useChatStore from "@/store/useChatStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserById } from "@/actions/chatActions";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

export async function deleteMessage(messageId: string) {
  const supabase = await createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("message")
    .update({ is_deleted: true })
    .eq("id", messageId);

  if (error) {
    throw new Error("Failed to mark the message as deleted");
  }

  return data;
}

export async function getAllMessages({ chatUserId }: { chatUserId: string }) {
  const supabase = await createBrowserSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error && !data?.session) {
    throw new Error("User is not authenticated");
  }

  const { data: messages, error: messagesError } = await supabase
    .from("message")
    .select("*")
    .or(`receiver.eq.${chatUserId},receiver.eq.${data?.session?.user.id}`)
    .or(`sender.eq.${chatUserId},sender.eq.${data?.session?.user.id}`)
    .order("created_at", { ascending: true });

  console.log(messages);

  if (messagesError) {
    throw new Error("Failed to get messages");
  }

  return messages;
}

export async function sendMessage({
  message,
  chatUserId,
}: {
  message: string;
  chatUserId: string;
}) {
  const supabase = await createBrowserSupabaseClient();

  const { data, error } = await supabase.auth.getSession();

  if (error && !data?.session) {
    throw new Error("User is not authenticated");
  }

  const { data: messages, error: sendMessageError } = await supabase
    .from("message")
    .insert({
      message,
      receiver: chatUserId,
      sender: data?.session?.user.id,
    });

  if (sendMessageError) {
    throw new Error("Failed to send a message");
  }

  return messages;
}

export default function ChatScreen() {
  const [message, setMessage] = React.useState("");
  const supabase = createBrowserSupabaseClient();
  const selectedIndexState = useChatStore((state) => state.selectedIndexState);
  const selectedUserIndex = useChatStore((state) => state.selectedUserIndex);
  const presenceState = useChatStore((state) => state.presenceState);
  const dummyScrollRef = useRef<HTMLDivElement>(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ["user", selectedIndexState],
    queryFn: async () => {
      const user = await getUserById(selectedIndexState);
      return user;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async () => {
      sendMessage({
        message,
        chatUserId: selectedIndexState,
      });
    },
    onSuccess: () => {
      setMessage("");
      refetch();
    },
  });

  const {
    data: messages,
    error: messagesError,
    isLoading: messagesLoading,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["messages", selectedIndexState],
    queryFn: async () => {
      const allMessages = await getAllMessages({
        chatUserId: selectedIndexState,
      });
      return allMessages;
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: async (messageId: any) => {
      await deleteMessage(messageId);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (messageId: any) => {
    deleteMutate(messageId);
  };

  useEffect(() => {
    const channel = supabase
      .channel("message_postgres_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" &&
            !payload.errors &&
            !!payload.new
          ) {
            refetch();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "message",
        },
        (payload) => {
          if (
            payload.eventType === "UPDATE" &&
            !payload.errors &&
            !!payload.new
          ) {
            refetch();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (dummyScrollRef.current) {
      dummyScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedIndexState !== "0" ? (
    <div className='w-full h-screen flex flex-col'>
      {/** User */}
      <Person
        index={selectedUserIndex}
        isActived={selectedIndexState === data?.id}
        name={data?.email?.split("@")[0] ?? ""}
        onChatScreen={false}
        onlineAt={presenceState?.[selectedIndexState]?.onlineAt}
        userId={data?.id ?? ""}
      />

      {/** Chat Field */}
      <div className='w-full overflow-y-scroll flex-1 flex flex-col p-4 gap-3'>
        {messages?.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            isFromMe={message.sender !== selectedIndexState}
            onDelete={() => handleDelete(message.id)}
            isDeleted={message.is_deleted}
          />
        ))}
        <div ref={dummyScrollRef} />
      </div>

      {/** Input Field */}
      <div className='flex'>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='p-3 w-full border-2 border-blue-400'
          placeholder='메시지를 입력하세요.'
        />

        <button
          onClick={() => mutate()}
          className='min-w-20 p-3 bg-blue-400 text-white'
          color='light-blue'
        >
          {isPending ? "전송중" : "전송"}
        </button>
      </div>
    </div>
  ) : (
    <div className='w-full'></div>
  );
}
