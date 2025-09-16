interface AmountSelectionPageProps {
  type: 'withdraw' | 'deposit';
  onAmountSelect: (amount: number) => void;
  currentBalance?: number;
}

// Import dollar bill images
import oneImg from '../assets/dollar-bills/one.png';
import fiveImg from '../assets/dollar-bills/five.png';
import tenImg from '../assets/dollar-bills/ten.png';
import twentyImg from '../assets/dollar-bills/twenty.png';
import fiftyImg from '../assets/dollar-bills/fifty.png';
import hundredImg from '../assets/dollar-bills/hundred.png';

export function AmountSelectionPage({ type, onAmountSelect, currentBalance = 0 }: AmountSelectionPageProps) {
  const amounts = [1, 5, 10, 20, 50, 100];
  const dollarImages = {
    1: oneImg,
    5: fiveImg,
    10: tenImg,
    20: twentyImg,
    50: fiftyImg,
    100: hundredImg
  };

  const title = type === 'withdraw' ? 'Select Amount to Withdraw' : 'Select Amount to Deposit';

  return (
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-semibold mb-4">{title}</h1>

        <div className="grid grid-cols-3 gap-6">
          {amounts.map((amount) => {
            const isDisabled = type === 'withdraw' && amount > currentBalance;
            return (
              <button
                key={amount}
                onClick={() => !isDisabled && onAmountSelect(amount)}
                disabled={isDisabled}
                className={`w-64 h-48 rounded-lg border-2 font-semibold flex flex-col items-center justify-evenly ${
                  isDisabled
                    ? 'bg-gray-300 border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-[#ffc72c] hover:bg-[#faa62e] active:bg-[#faa62e] text-black border-[#f0c028]'
                }`}
              >
                <div className="mx-6 shadow-lg shadow-black/30 rounded">
                  <img
                    src={dollarImages[amount as keyof typeof dollarImages]}
                    alt={`$${amount} bill`}
                    className="h-full w-full object-contain rounded"
                  />
                </div>
                <span className="text-3xl font-bold">${amount}</span>
              </button>
            );
          })}
        </div>
      </div>
  );
}
