import { useState } from 'react';

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message); // 상위 컴포넌트로 메시지를 전달
      setMessage(''); // 입력 필드를 초기화
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage(); // Enter 키를 누를 때 메시지 전송
    }
  };

  return (
    <div className="w-full bg-white absolute bottom-0 border-1 border p-[15px] flex items-center justify-between">
      <input
        type="text"
        className="w-full text-[14px] outline-none"
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="보내실 메시지를 입력하세요."
      />
      <button
        className="w-[90px] h-[35px] text-[14px] bg-self-msg-bg rounded-[8px]"
        onClick={handleSendMessage}
      >
        전송
      </button>
    </div>
  );
};

export default MessageInput;
