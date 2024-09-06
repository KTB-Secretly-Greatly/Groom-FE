import { useEffect, useRef } from 'react';
import { MessageType } from '../types/MessageType';
import { UserType } from '../types/UserType';
import Message from './Message';

export interface ChatLogsInterface {
  chatLogs: MessageType[];
  currentUserNickname: string;
  users: UserType[];
}

const ChatLogs = ({
  chatLogs,
  currentUserNickname,
  users,
}: ChatLogsInterface) => {
  const getUserProfileImage = (nickname: string) => {
    const user = users.find(user => user.nickname === nickname);
    return user ? user.profileImage : '';
  };

  const chatEndRef = useRef<HTMLDivElement>(null);

  // useEffect to scroll to the bottom whenever chatLogs change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLogs]);

  return (
    <ul className="w-full h-full p-4 flex flex-col pb-[67px]">
      {chatLogs.map((log, index) => (
        <Message
          key={index}
          nickname={log.nickname}
          profileImage={getUserProfileImage(log.nickname)}
          content={log.content}
          timestamp={log.timestamp}
          isMine={log.nickname === currentUserNickname}
        />
      ))}
      {/* Dummy div to scroll into */}
      <div ref={chatEndRef} />
    </ul>
  );
};

export default ChatLogs;
