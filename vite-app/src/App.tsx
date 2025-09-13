import { useState } from 'react'
import './App.css'

import { PinPage } from './pages';

type Page =
  | 'pin'
  | 'balance'
  | 'withdraw'
  | 'withdraw-summary'
  | 'deposit'
  | 'deposit-summary';

export default function App() {

  const [page, setPage] = useState<Page>('pin');

  return (
    <div className="h-full w-full" style={{ backgroundColor: '#E5E5E5' }}>
      {page === 'pin' && <PinPage setPage={setPage} />}
    </div>
  )
}
