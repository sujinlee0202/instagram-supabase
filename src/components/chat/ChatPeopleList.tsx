"use client";

import { useQuery } from "@tanstack/react-query";
import Person from "./Person";
import useChatStore from "@/store/useChatStore";
import { getAllUsers } from "@/actions/chatActions";
import { use, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";

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
          />
        );
      })}
    </div>
  );
}
