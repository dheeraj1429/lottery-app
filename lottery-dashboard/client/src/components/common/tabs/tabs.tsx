import { cn } from '@/lib/utils';
import React from 'react';
import { TabsListInterface, TabsTriggerInterface } from '.';

const TabsList = React.forwardRef<HTMLDivElement, TabsListInterface>(
   ({ className, ...props }, ref) => (
      <div
         ref={ref}
         className={cn(
            'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
            className,
         )}
         {...props}
      />
   ),
);

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerInterface>(
   ({ className, ...props }, ref) => (
      <button
         ref={ref}
         className={cn(
            'bg-gray-200 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
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

export { TabsList, TabsTrigger, TabsContent };
