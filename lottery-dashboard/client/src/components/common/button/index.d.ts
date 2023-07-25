export interface ButtonProps
   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   isLoading?: boolean;
   variation?: 'login-button' | 'deposit-btn' | 'wallet_button';
   children: React.ReactNode;
}
