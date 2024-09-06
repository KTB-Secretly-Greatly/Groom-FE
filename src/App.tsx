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
  const [remainingTime, setRemainingTime] = useState<number>(80); // 총 80초
  const wsRef = useRef<WebSocket | null>(null);
  const profileImage =
    'https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMTY0/MDAxNjA0MjI4ODc1MDgx.20zY0e0fjnqLYvyFxN2FuZl75yr0p-lejDrTdLzRargg.aDqPo9fsnwOujN45rK3vW-dUi2usn0wBwQE8xmstEBUg.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%EA%B0%88%EC%83%89.jpg?type=w400';

  useEffect(() => {
    if (currentUserNickname !== '' && ageGroup !== '') {
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
          message: null,
        };
        ws.send(JSON.stringify(newData));
      };

      ws.onmessage = event => {
        try {
          const receivedMessage = JSON.parse(event.data);

          if (receivedMessage.messageType === 'ENTER') {
            const newChatLog: MessageType = {
              nickname: 'System',
              message: `${receivedMessage.nickname}님이 채팅방에 입장했습니다.`,
              profileImage: '',
              timestamp: new Date().toLocaleTimeString('ko-KR', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              }),
            };
            setChatsLogs(prevChatLogs => [...prevChatLogs, newChatLog]);
          }

          if (receivedMessage.message) {
            const newChatLog: MessageType = {
              nickname: receivedMessage.nickname,
              message: receivedMessage.message,
              profileImage,
              timestamp: new Date().toLocaleTimeString('ko-KR', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
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

      // 타이머 시작
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;

          if (newTime <= 0) {
            clearInterval(timer);
            if (wsRef.current) {
              wsRef.current.close();
            }
          }

          // 남은 시간이 특정 값일 때만 라운드 메시지를 출력
          if (newTime === 60) {
            const msg =
              '첫 번째 라운드가 시작되었습니다. [취미]를 주제로 얘기해주세요.';
            const systemMessage: MessageType = {
              nickname: 'System',
              message: msg,
              profileImage: '',
              timestamp: new Date().toLocaleTimeString('ko-KR', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              }),
            };
            setChatsLogs(prevChatLogs => [...prevChatLogs, systemMessage]);
          } else if (newTime === 40) {
            const msg =
              '두 번째 라운드가 시작되었습니다. [하루일과]를 주제로 얘기해주세요.';
            const systemMessage: MessageType = {
              nickname: 'System',
              message: msg,
              profileImage: '',
              timestamp: new Date().toLocaleTimeString('ko-KR', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              }),
            };
            setChatsLogs(prevChatLogs => [...prevChatLogs, systemMessage]);
          } else if (newTime === 20) {
            const msg =
              '마지막 라운드가 시작되었습니다. [음식]을 주제로 얘기해주세요.';
            const systemMessage: MessageType = {
              nickname: 'System',
              message: msg,
              profileImage: '',
              timestamp: new Date().toLocaleTimeString('ko-KR', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              }),
            };
            setChatsLogs(prevChatLogs => [...prevChatLogs, systemMessage]);
          }

          return newTime;
        });
      }, 1000); // 1초마다 실행

      // cleanup 함수에서 WebSocket 및 타이머 닫기
      return () => {
        clearInterval(timer);
        ws.close();
      };
    }
  }, [currentUserNickname, ageGroup]);

  const addMessageToChatLogs = (newMessage: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const newData = {
        messageType: 'TALK',
        chatRoomId: 1,
        nickname: currentUserNickname,
        message: newMessage,
        profileImage,
      };
      wsRef.current.send(JSON.stringify(newData));
    }
  };

  const handleSetProfile = (nickname: string, ageGroup: string) => {
    setCurrentUserNickname(nickname);
    setAgeGroup(ageGroup);
  };

  // 남은 시간을 분:초 형식으로 변환
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-screen min-h-screen h-full flex flex-col bg-chat-bg">
      {currentUserNickname === '' ? (
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
          <div className="absolute top-[10px] right-[10px] p-2 bg-[rgba(255,255,255,0.5)] rounded-[4px] text-red-600 font-semibold">
            {formatTime(remainingTime)}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
