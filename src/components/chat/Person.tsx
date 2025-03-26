"use client";

import { getRandomImage } from "@/utils/randomImage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Props {
  index: number;
  userId: string;
  name: string;
  onlineAt: string;
  onChatScreen: boolean;
  isActived: boolean;
  onClick?: () => void;
}

export default function Person({ index, userId, name, onlineAt, onChatScreen, isActived, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex w-full min-w-60 gap-4 items-center p-4 
        ${onClick && "cursor-pointer"}
        ${!onChatScreen && isActived && "bg-blue-50"}
        ${!onChatScreen && !isActived && "bg-gray-50"} 
        ${onChatScreen && "bg-gray-50"}`}
    >
      <img src={getRandomImage(index)} alt={name} className="w-10 h-10 rounded-full"></img>

      <div>
        <p className="text-black font-bold text-xl">{name}</p>
        <p className="text-gray-500 text-sm">{dayjs(onlineAt).fromNow()}</p>
      </div>
    </div>
  );
}
