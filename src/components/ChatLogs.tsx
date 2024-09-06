import { useEffect, useRef } from 'react';
import { MessageType } from '../types/MessageType';
import Message from './Message';

export interface ChatLogsInterface {
  chatLogs: MessageType[];
  currentUserNickname: string;
}

const ChatLogs = ({ chatLogs, currentUserNickname }: ChatLogsInterface) => {
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
          profileImage={log.profileImage}
          message={log.message}
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
