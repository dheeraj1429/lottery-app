import React from 'react';
import { cn } from '@/lib/utils';

export interface Avatar {
   className?: string;
   children?: React.ReactNode;
}
export interface AvatarInterface
   extends Avatar,
      React.HTMLAttributes<HTMLDivElement> {}
export interface AvatarImageInterface
   extends Avatar,
      React.ImgHTMLAttributes<HTMLImageElement> {
   alt: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarInterface>(
   ({ className, children, ...props }, ref) => {
      return (
         <div
            ref={ref}
            className={cn(
               'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
               className,
            )}
            {...props}
         >
            {children}
         </div>
      );
   },
);

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageInterface>(
   ({ className, alt, children, ...props }, ref) => {
      return (
         <img
            alt={alt}
            ref={ref}
            className={cn(
               'aspect-square object-cover h-full w-full',
               className,
            )}
            {...props}
         >
            {children}
         </img>
      );
   },
);

export { Avatar, AvatarImage };
