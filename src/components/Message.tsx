interface UserMessageProps {
  nickname: string;
  profileImage: string;
  content: string;
  isMine: boolean;
}

const Message = ({
  nickname,
  profileImage,
  content,
  isMine,
}: UserMessageProps) => {
  return (
    <li className={`mb-[10px] ${isMine ? 'text-right' : ''}`}>
      <div className={`flex items-center ${isMine ? 'flex-row-reverse' : ''}`}>
        {isMine ? (
          <>
            <p className="ml-[5px]">{nickname}</p>
            <img
              className="w-[30px] h-[30px] rounded-full bg-cover bg-center mb-[5px]"
              src={profileImage}
              alt={`${nickname}의 프로필 이미지`}
            />
          </>
        ) : (
          <>
            <img
              className="w-[30px] h-[30px] rounded-full bg-cover bg-center mb-[5px]"
              src={profileImage}
              alt={`${nickname}의 프로필 이미지`}
            />
            <p className="ml-[5px]">{nickname}</p>
          </>
        )}
      </div>
      <p
        className={`text-[14px] p-2 rounded-lg mb-[10px] inline-block ${
          isMine ? 'bg-self-msg-bg self-end' : 'bg-white self-start'
        }`}
      >
        {content}
      </p>
    </li>
  );
};

export default Message;
