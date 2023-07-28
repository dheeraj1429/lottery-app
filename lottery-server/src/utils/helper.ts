import mongoose from 'mongoose';

export const responseObject = function (
   success: boolean,
   error: boolean,
   options?: any,
) {
   return { success, error, ...options };
};

export const checkIsValidId = function (id: string): boolean {
   const isValidId = mongoose.isValidObjectId(id);
   return isValidId;
};
