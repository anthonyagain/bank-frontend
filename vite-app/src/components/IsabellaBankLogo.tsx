import isabella_bank_logo from '../assets/isabella-bank.png';

export function IsabellaBankLogo({ className }: any) {
  return (
    <div className={className}>
      <img className="h-full" src={isabella_bank_logo} alt="Isabella Bank Logo" />
    </div>
  );
}
