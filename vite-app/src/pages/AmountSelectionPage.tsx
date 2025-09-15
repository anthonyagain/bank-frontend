interface AmountSelectionPageProps {
  type: 'withdraw' | 'deposit';
  onAmountSelect: (amount: number) => void;
  currentBalance?: number;
}

export function AmountSelectionPage({ type, onAmountSelect, currentBalance = 0 }: AmountSelectionPageProps) {
  const amounts = [1, 5, 10, 20, 50, 100];

  const title = type === 'withdraw' ? 'Select Amount to Withdraw' : 'Select Amount to Deposit';

  return (
      <div className="flex flex-col items-center gap-8 mt-8">
        <h1 className="text-3xl font-semibold mb-8">{title}</h1>

        <div className="grid grid-cols-3 gap-6">
          {amounts.map((amount) => {
            const isDisabled = type === 'withdraw' && amount > currentBalance;
            return (
              <button
                key={amount}
                onClick={() => !isDisabled && onAmountSelect(amount)}
                disabled={isDisabled}
                className={`w-32 h-20 rounded-lg text-3xl border-2 font-semibold ${
                  isDisabled
                    ? 'bg-gray-300 border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-[#ffc72c] hover:bg-[#faa62e] active:bg-[#faa62e] text-black border-[#f0c028]'
                }`}
              >
                ${amount}
              </button>
            );
          })}
        </div>
      </div>
  );
}
