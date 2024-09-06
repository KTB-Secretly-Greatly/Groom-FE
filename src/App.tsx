import { useEffect, useRef, useState } from 'react';
import './App.css';
import MessageInput from './components/MessageInput';
import { MessageType } from './types/MessageType';
import ChatLogs from './components/ChatLogs';
import UserProfileInput from './components/UserProfileInput';

function App() {
  const [chatLogs, setChatsLogs] = useState<MessageType[]>([]);
  const [currentUserNickname, setCurrentUserNickname] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  const profileImage =
    'https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMTY0/MDAxNjA0MjI4ODc1MDgx.20zY0e0fjnqLYvyFxN2FuZl75yr0p-lejDrTdLzRargg.aDqPo9fsnwOujN45rK3vW-dUi2usn0wBwQE8xmstEBUg.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%EA%B0%88%EC%83%89.jpg?type=w400';

  useEffect(() => {
    if (currentUserNickname !== '' && ageGroup != '') {
      const ws = new WebSocket('ws://localhost:8080/ws/chat');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connection opened');
        const newData = {
          messageType: 'ENTER',
          chatRoomId: 1,
          nickname: currentUserNickname,
          profileImage,
          ageGroup,
          message: null, // 메세지 내용은 비워둠
        };
        ws.send(JSON.stringify(newData));
      };

      ws.onmessage = event => {
        try {
          const receivedMessage = JSON.parse(event.data);

          // message가 있는 경우에만 채팅 로그에 추가
          if (receivedMessage.message) {
            const newChatLog: MessageType = {
              nickname: receivedMessage.nickname,
              message: receivedMessage.message,
              profileImage,
              timestamp: new Date().toLocaleTimeString('ko-KR', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true, // 12시간 형식 (오전/오후)
              }),
            };
            setChatsLogs(prevChatLogs => [...prevChatLogs, newChatLog]);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message', error);
        }
      };

      ws.onclose = event => {
        if (event.wasClean) {
          console.debug(
            `[close] Connection closed cleanly, code=${event.code}, reason=${event.reason}`,
          );
        } else {
          console.debug('[close] Connection died unexpectedly');
        }
      };

      ws.onerror = error => {
        console.error('WebSocket error', error);
      };

      // cleanup 함수에서 WebSocket 닫기
      return () => {
        ws.close();
      };
    }
  }, [currentUserNickname, ageGroup]);

  const addMessageToChatLogs = (newMessage: string) => {
    // WebSocket을 통해 서버로 메시지 전송
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const newData = {
        messageType: 'TALK', // 서버로 보낼 메시지 타입 설정
        chatRoomId: 1, // 채팅방 번호
        nickname: currentUserNickname, // 메시지 전송자의 닉네임
        message: newMessage, // 메세지 내용
        profileImage,
      };
      wsRef.current.send(JSON.stringify(newData));
    }
  };

  const handleSetProfile = (nickname: string, ageGroup: string) => {
    setCurrentUserNickname(nickname);
    setAgeGroup(ageGroup);
  };

  return (
    <div className="w-screen min-h-screen h-full flex flex-col bg-chat-bg">
      {currentUserNickname == '' ? (
        <UserProfileInput handleSetProfile={handleSetProfile} />
      ) : (
        <div className="w-full flex-grow relative">
          <ChatLogs
            chatLogs={chatLogs}
            currentUserNickname={currentUserNickname}
          />
          <div className="absolute bottom-0 w-full">
            <MessageInput
              onSendMessage={message => addMessageToChatLogs(message)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
