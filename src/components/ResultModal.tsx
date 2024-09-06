interface ResultModalProps {
  guessResult: boolean;
}

export const ResultModal = ({ guessResult }: ResultModalProps) => {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <h2 className="text-lg font-semibold mb-4">결과</h2>
        {guessResult ? (
          <p className="text-green-600 mb-4">상대방의 연령대를 맞췄습니다!</p>
        ) : (
          <p className="text-red-600 mb-4">상대방의 연령대를 틀렸습니다!</p>
        )}
      </div>
    </div>
  );
};
