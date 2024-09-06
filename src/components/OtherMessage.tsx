interface OtherMessageProps {
  nickname: string;
  profileImage: string;
  message: string;
  timestamp: string;
}

const OtherMessage = ({
  nickname,
  profileImage,
  message,
  timestamp,
}: OtherMessageProps) => {
  return (
    <div>
      <div className="flex items-center">
        <img
          className="w-[20px] h-[20px] rounded-full bg-cover bg-center mb-[5px]"
          src={profileImage}
          alt={`${nickname}의 프로필 이미지`}
        />
        <p className="ml-[5px] text-[14px]">{nickname}</p>
      </div>
      <p className="text-[14px] mb-[10px] relative">
        <span className="p-2 rounded-lg inline-block bg-white self-start">
          {message}
        </span>
        <span className="absolute bottom-0 text-[12px] text-timestamp-text ml-[5px]">
          {timestamp}
        </span>
      </p>
    </div>
  );
};

export default OtherMessage;
