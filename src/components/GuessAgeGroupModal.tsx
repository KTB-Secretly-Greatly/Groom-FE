import { useState } from 'react';
import { AgeGroup } from '../App';

type GuessAgeGroupModalProps = {
  onSubmit: (guess: AgeGroup) => void;
};

const GuessAgeGroupModal = ({ onSubmit }: GuessAgeGroupModalProps) => {
  const [guess, setGuess] = useState<AgeGroup | null>(null);
  const canSubmitGuess = guess !== null;

  const handleSubmit = () => {
    if (canSubmitGuess && guess !== null) {
      onSubmit(guess);
    } else {
      alert('연령대를 선택해주세요!');
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-center">
          상대방의 연령대를 맞춰보세요!
        </h2>

        {/* 연령대 선택 버튼 */}
        <div className="flex justify-between">
          <button
            className={`bg-white border border-gray-300 text-gray-800 w-[48%] p-3 rounded-md hover:bg-blue-100 hover:border-blue-500 transition duration-300 ${
              guess === AgeGroup.UNDER_40 ? 'bg-blue-500 !text-white' : ''
            }`}
            onClick={() => setGuess(AgeGroup.UNDER_40)}
          >
            40세 미만
          </button>
          <button
            className={`bg-white border border-gray-300 text-gray-800 w-[48%] p-3 rounded-md hover:bg-blue-100 hover:border-blue-500 transition duration-300 ${
              guess === AgeGroup.OVER_40 ? 'bg-blue-500 !text-white' : ''
            }`}
            onClick={() => setGuess(AgeGroup.OVER_40)}
          >
            40세 이상
          </button>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className={`${
              canSubmitGuess
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } w-full py-2 px-4 rounded mr-2`}
            disabled={!canSubmitGuess}
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuessAgeGroupModal;
