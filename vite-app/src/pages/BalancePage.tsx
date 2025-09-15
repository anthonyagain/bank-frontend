export function BalancePage({ setPage, currentBalance }: any) {
  return (
    <div className="h-full">
      {/* Main container with balance and buttons */}
      <div className="flex flex-col items-center h-full gap-8">
        {/* Balance window in center */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-8 text-center shadow-sm mb-10 mt-8">
          <h2 className="text-3xl mb-6 font-semibold">Account Balance</h2>
          <p className="text-5xl font-bold text-green-600">${currentBalance}</p>
        </div>

        {/* Withdraw and deposit buttons at bottom */}
        <div className="flex gap-12">
          <button
            onClick={() => currentBalance > 0 && setPage('withdraw')}
            disabled={currentBalance === 0}
            className={`w-48 h-20 rounded-lg text-3xl border-2 font-semibold ${
              currentBalance === 0
                ? 'bg-gray-300 border-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-[#ffc72c] hover:bg-[#faa62e] active:bg-[#faa62e] text-black border-[#f0c028]'
            }`}
          >
            Withdraw
          </button>
          <button
            onClick={() => setPage('deposit')}
            className="w-48 h-20 bg-[#ffc72c] hover:bg-[#faa62e] active:bg-[#faa62e] rounded-lg text-black text-3xl border-[#f0c028] border-2 font-semibold"
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
}
