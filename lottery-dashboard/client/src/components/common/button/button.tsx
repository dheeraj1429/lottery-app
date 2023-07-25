import React, { forwardRef } from 'react';
import classes from './button.module.css';
import { ButtonProps } from '.';
import CircularProgress from '@mui/material/CircularProgress';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
   (
      { variation, className, children, isLoading, ...props },
      ref,
   ): React.JSX.Element => {
      return (
         <button
            disabled={isLoading && true}
            className={className || classes[variation || 'login-button']}
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
