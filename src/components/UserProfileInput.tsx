import { useState } from 'react';

export interface UserProfileInputProps {
  handleSetProfile: (nickname: string, ageGroup: string) => void;
}

const UserProfileInput = ({ handleSetProfile }: UserProfileInputProps) => {
  const [nickname, setNickname] = useState<string>(''); // 닉네임 상태
  const [ageGroup, setAgeGroup] = useState<string>(''); // 연령대 상태
  const canSubmitProfile = nickname && ageGroup;

  const handleNicknameSubmit = () => {
    if (canSubmitProfile) {
      handleSetProfile(nickname, ageGroup); // 닉네임과 연령대를 모두 설정
    } else {
      alert('닉네임과 연령대를 모두 선택해주세요!');
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-[300px]">
        {/* 닉네임 입력 영역 */}
        <p className="font-semibold text-lg text-gray-700 mb-4 text-center">
          닉네임을 입력해주세요
        </p>
        <input
          type="text"
          placeholder="닉네임 입력"
          value={nickname}
          className="outline-none border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-3 rounded-md text-[14px] transition duration-300"
          onChange={e => setNickname(e.target.value)}
        />
        {/* 연령대 선택 영역 */}
        <p className="font-semibold text-lg text-gray-700 mt-6 mb-4 text-center">
          연령대를 선택해주세요
        </p>
        <div className="flex justify-between">
          <button
            className={`bg-white border border-gray-300 text-gray-800 w-[48%] p-3 rounded-md hover:bg-blue-100 hover:border-blue-500 transition duration-300 ${
              ageGroup === 'under40' ? 'bg-blue-500 !text-white' : ''
            }`}
            onClick={() => setAgeGroup('under40')}
          >
            40세 미만
          </button>
          <button
            className={`bg-white border border-gray-300 text-gray-800 w-[48%] p-3 rounded-md hover:bg-blue-100 hover:border-blue-500 transition duration-300 ${
              ageGroup === 'over40' ? 'bg-blue-500 !text-white' : ''
            }`}
            onClick={() => setAgeGroup('over40')}
          >
            40세 이상
          </button>
        </div>

        {/* 확인 버튼 */}
        <button
          className={`mt-6 w-full p-3 rounded-md transition duration-300 ${
            canSubmitProfile
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleNicknameSubmit}
          disabled={!canSubmitProfile} // 비활성화 상태 설정
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default UserProfileInput;
