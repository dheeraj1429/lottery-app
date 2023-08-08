import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = function (...input: ClassValue[]) {
   return twMerge(clsx(input));
};

export class AuthRequiredException extends Error {
   constructor(message: string) {
      super(message);
      this.name = 'AuthRequiredException';
   }
}
