interface MyMessageProps {
  nickname: string;
  profileImage: string;
  content: string;
  timestamp: string;
}

const MyMessage = ({
  nickname,
  profileImage,
  content,
  timestamp,
}: MyMessageProps) => {
  return (
    <div className="text-right">
      <div className="flex items-center flex-row-reverse">
        <p className="ml-[5px]">{nickname}</p>
        <img
          className="w-[30px] h-[30px] rounded-full bg-cover bg-center mb-[5px]"
          src={profileImage}
          alt={`${nickname}의 프로필 이미지`}
        />
      </div>
      <div className="flex justify-end items-end mb-[10px]">
        <p className="text-[12px] text-timestamp-text mr-[5px]">{timestamp}</p>
        <p className="p-2 rounded-lg inline-block bg-self-msg-bg">{content}</p>
      </div>
    </div>
  );
};

export default MyMessage;
