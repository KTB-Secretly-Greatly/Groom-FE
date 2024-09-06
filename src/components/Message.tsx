import OtherMessage from './OtherMessage';
import MyMessage from './MyMessage';

interface UserMessageProps {
  nickname: string;
  profileImage: string;
  content: string;
  timestamp: string;
  isMine: boolean;
}

const Message = ({
  nickname,
  profileImage,
  content,
  timestamp,
  isMine,
}: UserMessageProps) => {
  return (
    <li>
      {isMine ? (
        <MyMessage
          nickname={nickname}
          profileImage={profileImage}
          content={content}
          timestamp={timestamp}
        />
      ) : (
        <OtherMessage
          nickname={nickname}
          profileImage={profileImage}
          content={content}
          timestamp={timestamp}
        />
      )}
    </li>
  );
};

export default Message;
