import { cn } from '@/lib/utils';
import React from 'react';

export interface TabsListInterface
   extends React.HTMLAttributes<HTMLDivElement> {}
export interface TabsTriggerInterface
   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   active?: boolean;
}

const TabContainer = React.forwardRef<HTMLDivElement, TabsListInterface>(
   ({ children, ...props }, ref) => {
      return (
         <div ref={ref} {...props} className={cn('w-full')}>
            {children}
         </div>
      );
   },
);

const TabsList = React.forwardRef<HTMLDivElement, TabsListInterface>(
   ({ className, ...props }, ref) => (
      <div
         ref={ref}
         className={cn(
            'inline-flex h-10 items-center justify-center rounded-md bg-muted text-muted-foreground',
            className,
         )}
         {...props}
      />
   ),
);

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerInterface>(
   ({ className, active, ...props }, ref) => (
      <button
         ref={ref}
         className={cn(
            `bg-zinc-800 ${
               active ? 'bg-zinc-600' : 'bg-zinc-800'
            } text-gray-100 inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm`,
            className,
         )}
         {...props}
      />
   ),
);

const TabsContent = React.forwardRef<HTMLDivElement, TabsListInterface>(
   ({ className, ...props }, ref) => (
      <div
         ref={ref}
         className={cn(
            'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            className,
         )}
         {...props}
      />
   ),
);

export { TabContainer, TabsList, TabsTrigger, TabsContent };
