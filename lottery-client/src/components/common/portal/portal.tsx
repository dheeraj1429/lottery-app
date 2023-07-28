'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { createPortal } from 'react-dom';

export interface SheetPortalInterface
   extends React.HTMLAttributes<HTMLDivElement> {
   children?: React.ReactNode;
}

const SheetPortal = React.forwardRef<HTMLDivElement, SheetPortalInterface>(
   ({ className, children, ...props }, ref): React.JSX.Element => {
      return createPortal(
         <div
            ref={ref}
            {...props}
            className={cn(
               'w-full h-full fixed top-0 left-0 flex items-center justify-center',
               className,
            )}
         >
            {children}
         </div>,
         document.body as HTMLElement,
      );
   },
);

const SheetOverlay = React.forwardRef<HTMLDivElement, SheetPortalInterface>(
   ({ className, ...props }, ref): React.JSX.Element => {
      return (
         <div
            ref={ref}
            {...props}
            className={cn(
               'top-0 left-0 absolute w-full h-full backdrop-brightness-50 blur-sm',
               className,
            )}
         />
      );
   },
);

const SheetContent = React.forwardRef<HTMLDivElement, SheetPortalInterface>(
   ({ className, children, ...props }, ref): React.JSX.Element => {
      return (
         <div
            ref={ref}
            {...props}
            className={cn('relative z-50 w-96 bg-white shadow-lg', className)}
         >
            {children}
         </div>
      );
   },
);

const SheetHeader = ({
   className,
   children,
   ...props
}: SheetPortalInterface): React.JSX.Element => {
   return (
      <div
         className={cn(
            'w-full p-3 bg-gray-900 flex items-center justify-between',
            className,
         )}
         {...props}
      >
         {children}
      </div>
   );
};

const SheetTitle = React.forwardRef<HTMLDivElement, SheetPortalInterface>(
   ({ className, ...props }, ref) => (
      <div
         ref={ref}
         className={cn('text-gray-100 font-medium text-sm', className)}
         {...props}
      />
   ),
);

export { SheetOverlay, SheetContent, SheetHeader, SheetTitle };
export default SheetPortal;
