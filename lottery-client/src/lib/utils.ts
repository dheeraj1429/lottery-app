import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = function (...input: ClassValue[]) {
   return twMerge(clsx(input));
};
