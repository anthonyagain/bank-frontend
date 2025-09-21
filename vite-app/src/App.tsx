import { useMemo, useState } from 'react'
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
  // Track which fixed thresholds have been triggered this session
  const [triggeredThresholds, setTriggeredThresholds] = useState<Set<number>>(() => new Set());
  // Track the last multiple-of-2500 crossed (0 means none yet this session)
  const [lastMultiple2500, setLastMultiple2500] = useState<number>(0);
  // Track whether we've already warned about low balance (<= $50) this session
  const [lowBalanceWarned, setLowBalanceWarned] = useState<boolean>(false);
  // Dynamic alert message + type for the popup
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<'positive' | 'warning'>('positive');
  const [skipBalanceAnimation, setSkipBalanceAnimation] = useState<boolean>(true);

  const animatedBalance = useAnimatedNumber(currentBalance, 1500, skipBalanceAnimation);
  const { isAlertOpen: showPopup, fadeOut, showAlert, hideAlert } = useTemporaryAlert(5000);

  // Helper: currency formatter (no thousands separators)
  const formatCurrency = (amount: number) => `$${amount}`;

  // Fixed one-time thresholds per session
  const positiveThresholds = useMemo(
    () => [
      { amount: 300, message: 'Way to go!' },
      { amount: 400, message: "That's great! Keep up the saving!" },
      { amount: 600, message: "You're amazing at saving!" },
      { amount: 800, message: "That's an awesome deposit!" },
      { amount: 1000, message: "You're a saving superstar!" },
      { amount: 1500, message: "Keep saving—you're unstoppable!" },
    ],
    []
  );

  const updateBalanceWithPopup = (newBalance: number) => {
    const oldBalance = currentBalance;
    setSkipBalanceAnimation(false);
    setCurrentBalance(newBalance);

    // Determine direction of change
    if (newBalance > oldBalance) {
      // Depositing / increasing balance
      type Candidate = { priorityAmount: number; message: string; effect: () => void };
      const candidates: Candidate[] = [];

      // 1) Fixed positive thresholds (only once per session)
      const crossedPositives = positiveThresholds.filter(t => oldBalance < t.amount && newBalance >= t.amount && !triggeredThresholds.has(t.amount));
      for (const t of crossedPositives) {
        candidates.push({
          priorityAmount: t.amount,
          message: t.message,
          effect: () => {},
        });
      }

      // 2) Multiple-of-2500 popup (e.g., 2500, 5000, 7500...), each once per session
      const oldMultiple = Math.floor(oldBalance / 2500);
      const newMultiple = Math.floor(newBalance / 2500);
      if (newMultiple > oldMultiple && newMultiple > lastMultiple2500) {
        candidates.push({
          priorityAmount: newMultiple * 2500,
          message: `Wow, ${formatCurrency(newBalance)}! You're a savings champion!`,
          effect: () => setLastMultiple2500(newMultiple),
        });
      }

      if (candidates.length > 0) {
        // Show the highest-priority crossed threshold
        const top = candidates.reduce((a, b) => (a.priorityAmount >= b.priorityAmount ? a : b));
        setAlertType('positive');
        setAlertMessage(top.message);
        // Mark all crossed positive thresholds as triggered (once per session)
        if (candidates.some(c => c.priorityAmount <= 1500)) {
          const crossedAmounts = crossedPositives.map(t => t.amount);
          if (crossedAmounts.length > 0) {
            setTriggeredThresholds(prev => {
              const next = new Set(prev);
              crossedAmounts.forEach(a => next.add(a));
              return next;
            });
          }
        }
        // Apply effect for 2500-multiple candidate if selected (updates lastMultiple2500)
        top.effect();
        showAlert();
      }
    } else if (newBalance < oldBalance) {
      // Withdrawing / decreasing balance: low-balance warning once per session when crossing <= $50
      if (!lowBalanceWarned && oldBalance > 50 && newBalance <= 50) {
        setAlertType('warning');
        setAlertMessage('Caution: Your balance is getting low!');
        setLowBalanceWarned(true);
        showAlert();
      }
    }
  };

  const resetSession = () => {
    setSkipBalanceAnimation(true);
    setCurrentBalance(200);
    setTriggeredThresholds(new Set());
    setLastMultiple2500(0);
    setLowBalanceWarned(false);
    setAlertMessage("");
    setAlertType('positive');
    hideAlert();
  };

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="flex justify-center py-6 relative">
        <BankLogo className="h-48" />
        {page !== 'pin' && (
          <button
            onClick={() => {
              // Clear session on logout
              resetSession();
              setPage('pin');
            }}
            className="absolute top-6 right-6 bg-white border-2 border-gray-300 px-6 py-3 rounded-lg text-xl font-semibold hover:bg-gray-100 active:bg-gray-100"
          >
            Logout
          </button>
        )}
      </div>
      <div className="flex-1">
        {page === 'pin' && <PinPage setPage={setPage} resetBalance={resetSession} />}
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

      {/* Money threshold / warning popup */}
      {showPopup && (
        <div className={`fixed top-60 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none ${
          fadeOut ? 'animate-fade-out' : 'animate-slide-fade-in'
        }`}>
          <div className={`${alertType === 'warning' ? 'bg-red-300 border-red-400' : 'bg-green-400 border-green-500'} border-2 rounded-lg px-4 py-3`}>
            <h2 className="text-2xl font-medium text-black text-center whitespace-nowrap">
              {alertMessage}
            </h2>
          </div>
        </div>
      )}
    </div>
  )
}
