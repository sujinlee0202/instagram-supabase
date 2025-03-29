"use client";

import { getRandomImage } from "@/utils/randomImage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Props {
  index: number;
  userId: string;
  name: string | undefined;
  onlineAt: string;
  onChatScreen: boolean;
  isActived: boolean;
  onClick?: () => void;
  unreadCount?: number; // 읽지 않은 메시지 개수
}

export default function Person({
  index,
  userId,
  name,
  onlineAt,
  onChatScreen,
  isActived,
  onClick,
  unreadCount = 0,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex w-full min-w-60 gap-4 items-center p-4 
        ${onClick && "cursor-pointer"}
        ${!onChatScreen && isActived && "bg-blue-50"}
        ${!onChatScreen && !isActived && "bg-gray-50"} 
        ${onChatScreen && "bg-gray-50"}`}
    >
      <img
        src={getRandomImage(index)}
        alt={name}
        className='w-10 h-10 rounded-full'
      ></img>

      <div>
        <p className='text-black font-bold text-xl'>{name}</p>
        <p className='text-gray-500 text-sm'>{dayjs(onlineAt).fromNow()}</p>
      </div>

      {unreadCount > 0 && (
        <div className='bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center shrink-0'>
          {unreadCount}
        </div>
      )}
    </div>
  );
}
