import { useState } from 'react';
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
