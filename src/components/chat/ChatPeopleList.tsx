"use client";

import Person from "./Person";

export default function ChatPeopleList() {
  return (
    <div className='h-screen flex flex-col bg-gray-50 min-w-60'>
      <Person
        index={0}
        isActived={true}
        name='sujin'
        onChatScreen={false}
        onlineAt={new Date().toISOString()}
        userId='sujin'
        onClick={() => {}}
      />
      <Person
        index={0}
        isActived={false}
        name='sujin'
        onChatScreen={false}
        onlineAt={new Date().toISOString()}
        userId='sujin'
        onClick={() => {}}
      />
    </div>
  );
}
