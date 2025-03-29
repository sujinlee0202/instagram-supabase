"use client";

import { useQuery } from "@tanstack/react-query";
import Person from "./Person";
import useChatStore from "@/store/useChatStore";
import { getAllUsers } from "@/actions/chatActions";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

export async function getUnreadMessagesCount(userId: string) {
  const supabase = await createBrowserSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error && !data?.session) {
    throw new Error("User is not authenticated");
  }

  const {
    data: messages,
    error: countError,
    count,
  } = await supabase
    .from("message")
    .select("*", { count: "exact" })
    .eq("receiver", data?.session?.user.id)
    .eq("sender", userId)
    .eq("is_read", false);

  if (countError) {
    throw new Error("Failed to get unread messages count");
  }

  return count || 0;
}

export default function ChatPeopleList({
  logginedUser,
}: {
  logginedUser: any;
}) {
  const selectedIndexState = useChatStore((state) => state.selectedIndexState);
  const selectedUserIndex = useChatStore((state) => state.selectedUserIndex);
  const setSelectedIndexState = useChatStore(
    (state) => state.setSelectedIndexState
  );
  const setSelectedUserIndex = useChatStore(
    (state) => state.setSelectedUserIndex
  );
  const supabase = createBrowserSupabaseClient();
  const presenceState = useChatStore((state) => state.presenceState);
  const setPresenceState = useChatStore((state) => state.setPresenceState);

  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>(
    {}
  );

  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const allUsers = await getAllUsers();
      return allUsers.filter((user) => user.id !== logginedUser.id);
    },
  });

  useEffect(() => {
    const channel = supabase.channel("online-users", {
      config: {
        presence: {
          key: logginedUser.id,
        },
      },
    });

    channel.on(
      "presence",
      {
        event: "sync",
      },
      () => {
        const newState = channel.presenceState();
        console.log(newState);
        const newStateObject = JSON.parse(JSON.stringify(newState));
        setPresenceState(newStateObject);
      }
    );

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;

      const newPresenceStatus = await channel.track({
        onlineAt: new Date().toISOString(),
      });

      console.log(newPresenceStatus);
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("message_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message",
        },
        () => {
          fetchUnreadCounts();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [data]);

  useEffect(() => {
    if (data) {
      fetchUnreadCounts();
    }
  }, [data]);

  const fetchUnreadCounts = async () => {
    if (!data) return;

    const counts: { [key: string]: number } = {};

    for (const user of data) {
      const count = await getUnreadMessagesCount(user.id);
      counts[user.id] = count;
    }

    setUnreadCounts(counts);
  };

  const handleClickPerson = (userId: string, index: number) => {
    setSelectedIndexState(userId);
    setSelectedUserIndex(index);
  };

  return (
    <div className='h-screen flex flex-col bg-gray-50 min-w-60'>
      {data?.map((user, index) => {
        return (
          <Person
            key={index}
            index={index}
            isActived={selectedIndexState === user.id}
            name={user.email?.split("@")[0]}
            onChatScreen={false}
            onlineAt={presenceState?.[user.id]?.onlineAt}
            userId={user.id}
            onClick={() => handleClickPerson(user.id, index)}
            unreadCount={unreadCounts[user.id] || 0} // 읽지 않은 메시지 개수 전달
          />
        );
      })}
    </div>
  );
}
