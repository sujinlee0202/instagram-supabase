"use client";

import Person from "./Person";
import useChatStore from "@/store/useChatStore";

export default function ChatPeopleList() {
  const selectedIndex = useChatStore((state) => state.selectedIndex);
  const setSelectedIndex = useChatStore((state) => state.setSelectedIndex);

  const handleClickPerson = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 min-w-60">
      <Person index={selectedIndex} isActived={selectedIndex === 0} name="sujin" onChatScreen={false} onlineAt={new Date().toISOString()} userId="sujin" onClick={() => handleClickPerson(0)} />
      <Person index={selectedIndex} isActived={selectedIndex === 1} name="sujin" onChatScreen={false} onlineAt={new Date().toISOString()} userId="sujin" onClick={() => handleClickPerson(1)} />
    </div>
  );
}
