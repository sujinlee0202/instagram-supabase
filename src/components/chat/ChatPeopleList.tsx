"use client";

import { useQuery } from "@tanstack/react-query";
import Person from "./Person";
import useChatStore from "@/store/useChatStore";
import { getAllUsers } from "@/actions/chatActions";
import { use } from "react";

export default function ChatPeopleList({ logginedUser }: { logginedUser: any }) {
  const selectedIndexState = useChatStore((state) => state.selectedIndexState);
  const selectedUserIndex = useChatStore((state) => state.selectedUserIndex);
  const setSelectedIndexState = useChatStore((state) => state.setSelectedIndexState);
  const setSelectedUserIndex = useChatStore((state) => state.setSelectedUserIndex);

  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const allUsers = await getAllUsers();
      return allUsers.filter((user) => user.id !== logginedUser.id);
    },
  });

  const handleClickPerson = (userId: string, index: number) => {
    setSelectedIndexState(userId);
    setSelectedUserIndex(index);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 min-w-60">
      {data?.map((user, index) => {
        return (
          <Person
            key={index}
            index={index}
            isActived={selectedIndexState === user.id}
            name={user.email?.split("@")[0]}
            onChatScreen={false}
            onlineAt={new Date().toISOString()}
            userId={user.id}
            onClick={() => handleClickPerson(user.id, index)}
          />
        );
      })}
    </div>
  );
}
