interface SummaryPageProps {
  type: 'withdraw' | 'deposit';
  amount: number;
  currentBalance: number;
  setPage: (page: string) => void;
  updateBalance: (newBalance: number) => void;
}

import { useState } from 'react';

export function SummaryPage({ type, amount, currentBalance, setPage, updateBalance }: SummaryPageProps) {
  const [layout, setLayout] = useState<1 | 2>(1);
  const title = type === 'withdraw' ? 'Withdrawal Summary' : 'Deposit Summary';
  const actionText = type === 'withdraw' ? 'Confirm Withdrawal' : 'Confirm Deposit';
  const operation = type === 'withdraw' ? '-' : '+';
  const newBalance = type === 'withdraw' ? currentBalance - amount : currentBalance + amount;

  const handleConfirm = () => {
    updateBalance(newBalance);
    setPage('balance');
  };

  const handleCancel = () => {
    setPage('balance');
  };

  return (
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-3xl font-semibold">{title}</h1>

        <div className="bg-white border-2 border-gray-300 rounded-lg p-12 text-center shadow-sm">
          {layout === 1 ? (
            <div className="text-3xl">
              <div className="mb-4">Current Balance: <span className="font-bold text-green-600">${currentBalance}</span></div>
              <div className="mb-4">{operation} <span className="font-bold">${amount}</span></div>
              <hr className="border-gray-400 my-4" />
              <div className="mt-4">New Balance: <span className="font-bold text-green-600">${newBalance}</span></div>
            </div>
          ) : (
            <div className="text-4xl flex items-center justify-center gap-8">
              <span className="font-bold text-green-600">${currentBalance}</span>
              <span className="font-bold">{operation}</span>
              <span className="font-bold">${amount}</span>
              <span className="font-bold">=</span>
              <span className="font-bold text-green-600">${newBalance}</span>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          <button
            onClick={handleCancel}
            className="w-32 h-16 bg-white border-2 border-gray-300 rounded-lg text-black text-xl font-semibold hover:bg-gray-100 active:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="w-56 h-16 bg-[#ffc72c] hover:bg-[#faa62e] active:bg-[#faa62e] rounded-lg text-black text-xl border-[#f0c028] border-2 font-semibold"
          >
            {actionText}
          </button>
        </div>

        {/* Layout toggle buttons */}
        <div className="fixed bottom-4 left-4 flex flex-col gap-2">
          <button
            onClick={() => setLayout(1)}
            className={`px-3 py-2 rounded text-white text-sm font-semibold ${
              layout === 1 ? 'bg-blue-400' : 'bg-blue-300 hover:bg-blue-350'
            }`}
          >
            Layout 1
          </button>
          <button
            onClick={() => setLayout(2)}
            className={`px-3 py-2 rounded text-white text-sm font-semibold ${
              layout === 2 ? 'bg-blue-400' : 'bg-blue-300 hover:bg-blue-350'
            }`}
          >
            Layout 2
          </button>
        </div>
      </div>
  );
}
