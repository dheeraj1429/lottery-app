import React, { forwardRef } from 'react';
import classes from './button.module.css';
import CircularProgress from '@mui/material/CircularProgress';

export interface ButtonProps
   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   isLoading?: boolean;
   variation?: 'login-button' | 'deposit-btn' | 'wallet_button' | 'tit_btn';
   children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
   (
      { variation, className, children, isLoading, ...props },
      ref,
   ): React.JSX.Element => {
      return (
         <button
            disabled={isLoading && true}
            className={`${classes[variation || 'login-button']} ${className}`}
            ref={ref}
            {...props}
         >
            {isLoading ? (
               <div className="flex items-center justify-center p-1">
                  <CircularProgress
                     size={'22px'}
                     style={{
                        color: '#fff',
                     }}
                  />
               </div>
            ) : (
               children
            )}
         </button>
      );
   },
);

export default Button;
