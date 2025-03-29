"use client";

interface Props {
  isFromMe: boolean;
  message: string;
  onDelete: () => void;
  isDeleted?: boolean;
  isRead?: boolean;
}

export default function Message({
  isDeleted,
  isFromMe,
  message,
  onDelete,
  isRead,
}: Props) {
  return (
    <div
      className={`flex items-center space-x-2 ${isFromMe ? "justify-end" : ""}`}
    >
      {isFromMe && !isDeleted && (
        <button onClick={onDelete} className='text-sm text-red-500'>
          삭제
        </button>
      )}
      {isFromMe && !isDeleted && isRead && (
        <span className='text-xs text-gray-500'>읽음</span>
      )}
      <div
        className={`w-fit p-3 rounded-md ${
          isFromMe ? "bg-blue-400 text-white" : "bg-gray-100 text-black"
        }`}
      >
        {isDeleted ? <p>삭제된 메시지입니다</p> : <p>{message}</p>}
      </div>
    </div>
  );
}
