import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import MessageInput from './components/MessageInput';
import { MessageType } from './types/MessageType';
import ChatLogs from './components/ChatLogs';
import UserProfileInput from './components/UserProfileInput';
import GuessAgeGroupModal from './components/GuessAgeGroupModal';
import { ResultModal } from './components/ResultModal';

export enum AgeGroup {
  UNDER_40 = 'under40',
  OVER_40 = 'over40',
}

function App() {
  const [chatLogs, setChatsLogs] = useState<MessageType[]>([]);
  const [currentUserNickname, setCurrentUserNickname] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(80); // 총 80초
  const [participants, setParticipants] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [opponentAgeGroup, setOpponentAgeGroup] = useState<AgeGroup | null>(
    null,
  );
  const [guessResult, setGuessResult] = useState<boolean>(false);
  const [isShowResultModal, setIsShowResultModal] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);
  const profileImage =
    'https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMTY0/MDAxNjA0MjI4ODc1MDgx.20zY0e0fjnqLYvyFxN2FuZl75yr0p-lejDrTdLzRargg.aDqPo9fsnwOujN45rK3vW-dUi2usn0wBwQE8xmstEBUg.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%EA%B0%88%EC%83%89.jpg?type=w400';

  useEffect(() => {
    if (currentUserNickname !== '' && ageGroup !== null) {
      const ws = new WebSocket('ws://localhost:8080/ws/chat');
      wsRef.current = ws;

      ws.onopen = () => {
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

            // 서버에서 받은 참가자 수로 업데이트
            if (receivedMessage.participants) {
              setParticipants(receivedMessage.participants);
            }
          }

          // 나이 그룹 관련 정보는 변수에 저장하고 로그에는 추가하지 않음
          if (
            receivedMessage.messageType === 'TALK' &&
            receivedMessage.message.includes('나이 그룹은')
          ) {
            const regex = /나이 그룹은 (under40|over40)/;
            const match = receivedMessage.message.match(regex);

            if (match && match[1]) {
              const extractedAgeGroup = match[1];
              if (
                extractedAgeGroup === AgeGroup.OVER_40 ||
                extractedAgeGroup === AgeGroup.UNDER_40
              ) {
                setOpponentAgeGroup(extractedAgeGroup as AgeGroup);
              }
            }

            return;
          }

          // 다른 일반 메시지는 채팅 로그에 추가
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

          // 참가자 수 업데이트
          if (receivedMessage.participants) {
            setParticipants(receivedMessage.participants);
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

      return () => {
        ws.close();
      };
    }
  }, [currentUserNickname, ageGroup]);

  const handleGuessSubmit = (guess: AgeGroup) => {
    setShowModal(false);

    const correctGuess = guess === opponentAgeGroup;
    setGuessResult(correctGuess);
    setIsShowResultModal(true);
  };

  useEffect(() => {
    if (participants === 2) {
      // 참가자 수가 2명일 때 게임 시작
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const systemMessage: MessageType = {
          nickname: 'System',
          message: '채팅이 시작되었습니다. 자유롭게 대화를 나눠주세요.',
          profileImage: '',
          timestamp: new Date().toLocaleTimeString('ko-KR', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }),
        };
        setChatsLogs(prevChatLogs => [...prevChatLogs, systemMessage]);
      }

      const timer = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;

          if (newTime <= 0) {
            clearInterval(timer);
            setShowModal(true);
            if (wsRef.current) {
              wsRef.current.close();
            }
          }

          if (newTime === 60 || newTime === 40 || newTime === 20) {
            const systemMessages = {
              60: '첫 번째 라운드가 시작되었습니다. [취미]를 주제로 얘기해주세요.',
              40: '두 번째 라운드가 시작되었습니다. [하루일과]를 주제로 얘기해주세요.',
              20: '마지막 라운드가 시작되었습니다. [음식]을 주제로 얘기해주세요.',
            };
            const systemMessage: MessageType = {
              nickname: 'System',
              message: systemMessages[newTime],
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
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [participants]);

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

  const handleSetProfile = (nickname: string, ageGroup: AgeGroup) => {
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
          <div className="fixed top-[10px] right-[10px] p-2 bg-[rgba(255,255,255,0.5)] rounded-[4px] text-red-600 font-semibold">
            {formatTime(remainingTime)}
          </div>
        </div>
      )}

      {showModal && <GuessAgeGroupModal onSubmit={handleGuessSubmit} />}

      {isShowResultModal && <ResultModal guessResult={guessResult} />}
    </div>
  );
}

export default App;
