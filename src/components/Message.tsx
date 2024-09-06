import OtherMessage from './OtherMessage';
import MyMessage from './MyMessage';

interface UserMessageProps {
  nickname: string;
  profileImage: string;
  message: string;
  timestamp: string;
  isMine: boolean;
}

const Message = ({
  nickname,
  profileImage,
  message,
  timestamp,
  isMine,
}: UserMessageProps) => {
  return (
    <li>
      {isMine ? (
        <MyMessage
          nickname={nickname}
          profileImage={profileImage}
          message={message}
          timestamp={timestamp}
        />
      ) : (
        <OtherMessage
          nickname={nickname}
          profileImage={profileImage}
          message={message}
          timestamp={timestamp}
        />
      )}
    </li>
  );
};

export default Message;
