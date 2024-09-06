import { ReactComponent as SystemIcon } from '../assets/SystemIcon.svg';

interface SystemMessageProps {
  message: string;
  timestamp: string;
}

const SystemMessage = ({ message }: SystemMessageProps) => {
  return (
    <li className="w-full text-center bg-gray-100 border border-gray-300 rounded-lg p-3 text-gray-700 text-sm my-2 flex items-center justify-center">
      <SystemIcon className="w-6 h-6 mr-3" fill="#3b82f6" />
      <p className="ml-[10px] font-medium text-gray-600">{message}</p>
    </li>
  );
};

export default SystemMessage;
