import bank_logo from '../assets/bank.png';

export function BankLogo({ className }: any) {
  return (
    <div className={className}>
      <img className="h-full" src={bank_logo} alt="Bank Logo" />
    </div>
  );
}
