import { useState } from 'react'
import './App.css'

import { PinPage, BalancePage, AmountSelectionPage, SummaryPage } from './pages';
import { BankLogo } from './components';
// @ts-ignore
import { useTemporaryAlert } from './hooks/useTemporaryAlert';
import { useAnimatedNumber } from './hooks/useAnimatedNumber';

type Page =
  | 'pin'
  | 'balance'
  | 'withdraw'
  | 'withdraw-summary'
  | 'deposit'
  | 'deposit-summary';

export default function App() {

  const [page, setPage] = useState<Page>('pin');
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [currentBalance, setCurrentBalance] = useState<number>(200);
  const [moneyThreshold, setMoneyThreshold] = useState<number>(2500);

  const animatedBalance = useAnimatedNumber(currentBalance, 1500);
  const { isAlertOpen: showPopup, fadeOut, showAlert } = useTemporaryAlert(5000);

  const updateBalanceWithPopup = (newBalance: number) => {
    const oldBalance = currentBalance;
    setCurrentBalance(newBalance);

    // Check if we've crossed the threshold
    if (oldBalance < moneyThreshold && newBalance >= moneyThreshold) {
      showAlert();
      // Increase threshold by 2500 each time
      setMoneyThreshold(prev => prev + 2500);
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="flex justify-center py-6 relative">
        <BankLogo className="h-48" />
        {page !== 'pin' && (
          <button
            onClick={() => setPage('pin')}
            className="absolute top-6 right-6 bg-white border-2 border-gray-300 px-6 py-3 rounded-lg text-xl font-semibold hover:bg-gray-100 active:bg-gray-100"
          >
            Logout
          </button>
        )}
      </div>
      <div className="flex-1">
        {page === 'pin' && <PinPage setPage={setPage} resetBalance={() => setCurrentBalance(200)} />}
        {page === 'balance' && <BalancePage setPage={setPage} currentBalance={currentBalance} animatedBalance={animatedBalance} />}
        {page === 'withdraw' && (
          <AmountSelectionPage
            type="withdraw"
            currentBalance={currentBalance}
            onAmountSelect={(amount) => {
              setPendingAmount(amount);
              setPage('withdraw-summary');
            }}
          />
        )}
        {page === 'deposit' && (
          <AmountSelectionPage
            type="deposit"
            onAmountSelect={(amount) => {
              setPendingAmount(amount);
              setPage('deposit-summary');
            }}
          />
        )}
        {page === 'withdraw-summary' && pendingAmount !== null && (
          <SummaryPage
            type="withdraw"
            amount={pendingAmount}
            currentBalance={currentBalance}
            setPage={setPage}
            updateBalance={updateBalanceWithPopup}
          />
        )}
        {page === 'deposit-summary' && pendingAmount !== null && (
          <SummaryPage
            type="deposit"
            amount={pendingAmount}
            currentBalance={currentBalance}
            setPage={setPage}
            updateBalance={updateBalanceWithPopup}
          />
        )}
      </div>

      {/* Money threshold popup */}
      {showPopup && (
        <div className={`fixed top-60 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none ${
          fadeOut ? 'animate-fade-out' : 'animate-slide-fade-in'
        }`}>
          <div className="bg-green-400 border-2 border-green-500 rounded-lg px-4 py-3">
            <h2 className="text-2xl font-medium text-black text-center whitespace-nowrap">
              Wow, that's a lot of money! 💰
            </h2>
          </div>
        </div>
      )}
    </div>
  )
}
