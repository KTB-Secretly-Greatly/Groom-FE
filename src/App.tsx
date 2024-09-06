import { useEffect, useRef, useState } from 'react';
import './App.css';
import MessageInput from './components/MessageInput';
import { MessageType } from './types/MessageType';
import { UserType } from './types/UserType';
import ChatLogs from './components/ChatLogs';

function App() {
  const [users, setUsers] = useState<UserType[]>([
    {
      nickname: 'me',
      profileImage:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN1MxQpdnaeXnxFs5jCVLMh1XOkC5ZHuksBw&s',
    },
    {
      nickname: 'other1',
      profileImage:
        'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
    },
    {
      nickname: 'other2',
      profileImage:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSyRpDYySITeW4scxxiH4VQXGDW78Im0mpVKTrAsd7dEHLSy1DhuMuptFdiw&s',
    },
  ]);

  const [chatLogs, setChatsLogs] = useState<MessageType[]>([
    {
      nickname: 'me',
      content: '제가 보낸 메시지입니다.',
      timestamp: '오후 12:04',
    },
    {
      nickname: 'other1',
      content: '안녕하세요! 저는 다른 사람입니다.',
      timestamp: '오후 2:14',
    },
    {
      nickname: 'other2',
      content: '안녕하세요! 저는 다른 사람입니다.',
      timestamp: '오후 2:14',
    },
    {
      nickname: 'other1',
      content: 'ㅎㅇㅎㅇ요',
      timestamp: '오후 2:14',
    },
  ]);

  const currentUserNickname = 'me';

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (currentUserNickname) {
      wsRef.current = new WebSocket('ws://localhost:8080/chat');

      wsRef.current.onopen = () => console.debug('Connection opened');

      wsRef.current.onmessage = event => {
        try {
          const receivedMessage = JSON.parse(event.data); // JSON으로 파싱
          const newChatLog: MessageType = {
            nickname: receivedMessage.nickname,
            content: receivedMessage.content,
            timestamp: new Date().toLocaleTimeString('ko-KR', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true, // 12시간 형식 (오전/오후)
            }),
          };
          setChatsLogs(prevChatLogs => [...prevChatLogs, newChatLog]);
        } catch (error) {
          console.error('Failed to parse WebSocket message', error);
        }
      };

      wsRef.current.onclose = event => {
        if (event.wasClean) {
          console.debug(
            `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`,
          );
        } else {
          console.debug('[close] Connection died');
        }
      };

      return () => wsRef.current?.close();
    }

    return undefined;
  }, [currentUserNickname]);

  const addMessageToChatLogs = (newMessage: string, nickname: string) => {
    const currentTime = new Date();
    const newChatLog = {
      nickname,
      content: newMessage,
      timestamp: currentTime.toLocaleTimeString('ko-KR', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // 12시간 형식 (오전/오후)
      }),
    };

    // WebSocket을 통해 서버로 메시지 전송
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const newData = {
        messageType: 'TALK', // ENTER, TALK
        chatRoomId: 1, // 채팅방 번호
        senderId: 1, // 메세지 전송자의 UserId
        message: newMessage, // 메세지 내용
      };
      wsRef.current.send(JSON.stringify(newData));
    }

    // 로컬 상태에 메시지 추가
    setChatsLogs([...chatLogs, newChatLog]);
  };

  return (
    <div className="w-screen min-h-screen h-full flex flex-col bg-chat-bg">
      <div className="w-full flex-grow relative">
        <ChatLogs
          chatLogs={chatLogs}
          currentUserNickname={currentUserNickname}
          users={users}
        />
        <div className="absolute bottom-0 w-full">
          <MessageInput
            onSendMessage={message =>
              addMessageToChatLogs(message, currentUserNickname)
            }
          />
        </div>
      </div>
    </div>
  );
}

export default App;
