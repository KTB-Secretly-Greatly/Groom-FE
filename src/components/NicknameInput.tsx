export interface NicknameInputProps {
  handleSetNickname: (nickname: string) => void;
}

const NicknameInput = ({ handleSetNickname }: NicknameInputProps) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-[300px]">
        <p className="font-semibold text-lg text-gray-700 mb-4 text-center">
          닉네임을 입력해주세요
        </p>
        <input
          type="text"
          placeholder="닉네임 입력"
          className="outline-none border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-3 rounded-md text-[14px] transition duration-300"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter')
              handleSetNickname((e.target as HTMLInputElement).value);
          }}
        />
        <button
          className="mt-4 bg-blue-500 text-white w-full p-3 rounded-md hover:bg-blue-600 transition duration-300"
          onClick={() => {
            const input =
              document.querySelector<HTMLInputElement>('input[type="text"]');
            if (input) handleSetNickname(input.value);
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default NicknameInput;
