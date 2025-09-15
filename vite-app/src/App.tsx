import { useState } from 'react'
import './App.css'

import { PinPage, BalancePage, AmountSelectionPage, SummaryPage } from './pages';
import { BankLogo } from './components';

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
        {page === 'balance' && <BalancePage setPage={setPage} currentBalance={currentBalance} />}
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
            updateBalance={setCurrentBalance}
          />
        )}
        {page === 'deposit-summary' && pendingAmount !== null && (
          <SummaryPage
            type="deposit"
            amount={pendingAmount}
            currentBalance={currentBalance}
            setPage={setPage}
            updateBalance={setCurrentBalance}
          />
        )}
      </div>
    </div>
  )
}
