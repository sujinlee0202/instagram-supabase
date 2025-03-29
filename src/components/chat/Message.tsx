"use client";

interface Props {
  isFromMe: boolean;
  message: string;
  onDelete: () => void;
  isDeleted?: boolean;
}

export default function Message({
  isDeleted,
  isFromMe,
  message,
  onDelete,
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
