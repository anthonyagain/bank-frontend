import { useState } from 'react';

function PinPad({ pin, setPin, submit }: any) {

  const removeDigit = () => setPin(pin.slice(0, -1));
  const addDigit = (digit: any) => pin.length < 4 && setPin(pin + digit.toString());

  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
        <button
          key={digit}
          onClick={() => addDigit(digit)}
          className="w-16 h-16 bg-white border-2 border-gray-300 rounded-lg text-xl font-semibold hover:bg-gray-100 active:bg-gray-100"
        >
          {digit}
        </button>
      ))}
      <button
        onClick={removeDigit}
        className="w-16 h-16 bg-white border-2 border-gray-300 rounded-lg text-lg font-semibold hover:bg-gray-100 active:bg-gray-100"
      >
        ←
      </button>
      <button
        onClick={() => addDigit(0)}
        className="w-16 h-16 bg-white border-2 border-gray-300 rounded-lg text-xl font-semibold hover:bg-gray-100 active:bg-gray-100"
      >
        0
      </button>
      <button
        onClick={submit}
        disabled={pin.length !== 4}
        className="
          w-16 h-16 bg-[#ffc72c] hover:bg-[#faa62e] active:bg-[#faa62e] rounded-lg text-black text-lg border-[#f0c028] border-2 font-semibold
         disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-400
        "
      >
        ✓
      </button>
    </div>
  );
}

export function PinPage({ setPage, resetBalance }: any) {

  const [pin, setPin] = useState("");

  return (
    <div className="flex flex-col items-center h-full">
      <div className="text-center">
        <p className="text-3xl mb-6 font-semibold">Enter your PIN</p>
        {/* four digit text section, starts out as four "_", then numbers get placed above them as entered */}
        <div className="flex gap-4 mb-8 mt-8">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="w-14 h-14 border-2 border-gray-400 rounded flex items-center justify-center text-2xl font-medium">
              {pin[index] || "_"}
            </div>
          ))}
        </div>
      </div>
      <PinPad
        pin={pin}
        setPin={setPin}
        submit={() => {
          if (pin.length === 4) {
            resetBalance();
            setPage('balance');
          }
        }}
      />
    </div>
  )
}
