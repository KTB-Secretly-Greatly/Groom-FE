import { useEffect, useRef } from 'react';
import { MessageType } from '../types/MessageType';
import Message from './Message';
import SystemMessage from './SystemMessage';

export interface ChatLogsInterface {
  chatLogs: MessageType[];
  currentUserNickname: string;
}

const ChatLogs = ({ chatLogs, currentUserNickname }: ChatLogsInterface) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLogs]);

  return (
    <ul className="w-full h-full p-4 flex flex-col pb-[67px]">
      {chatLogs.map((log, index) => {
        // 시스템 메시지일 경우 별도의 UI로 렌더링
        if (log.nickname === 'System') {
          return (
            <SystemMessage
              key={`${index}${log.message}`} // key를 설정
              message={log.message}
              timestamp={log.timestamp}
            />
          );
        }

        // 일반 메시지는 Message 컴포넌트로 렌더링
        return (
          <Message
            key={`${index}${log.nickname}${log.message}`}
            nickname={log.nickname}
            profileImage={log.profileImage}
            message={log.message}
            timestamp={log.timestamp}
            isMine={log.nickname === currentUserNickname}
          />
        );
      })}
      <div ref={chatEndRef} />
    </ul>
  );
};

export default ChatLogs;
