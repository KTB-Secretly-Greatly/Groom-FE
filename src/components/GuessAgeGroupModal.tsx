import { useState } from 'react';
import { AgeGroup } from '../App';

type GuessAgeGroupModalProps = {
  onSubmit: (guess: AgeGroup) => void;
  onClose: () => void;
};

const GuessAgeGroupModal = ({ onSubmit, onClose }: GuessAgeGroupModalProps) => {
  const [guess, setGuess] = useState<AgeGroup | ''>('');

  const handleSubmit = () => {
    if (guess !== '') {
      onSubmit(guess);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          상대방의 연령대를 맞춰보세요!
        </h2>

        <select
          value={guess}
          onChange={e => setGuess(e.target.value as AgeGroup)} // string을 AgeGroup으로 변환
          className="border p-2 rounded"
        >
          <option value="">선택하세요</option>
          <option value={AgeGroup.UNDER_40}>40세 미만</option>
          <option value={AgeGroup.OVER_40}>40세 이상</option>
        </select>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
          >
            제출
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuessAgeGroupModal;
