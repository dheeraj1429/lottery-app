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

export function validateObject(
   obj: any,
   requiredProperties: string[],
): { error: string } {
   if (!obj) {
      return {
         error: `Api response missing all property: Api response id ${obj}`,
      };
   }

   for (const prop of requiredProperties) {
      if (!(prop in obj)) {
         return {
            error: `Api response missing required property: ${prop}`,
         };
      }
   }

   return {
      error: null,
   };
}

export function generateUniqueRandomNumbers(
   count: number,
   min: number,
   max: number,
) {
   if (count > max - min + 1) {
      throw new Error(
         'Cannot generate unique random numbers. The range is smaller than the count.',
      );
   }

   const numbers = [];

   while (numbers.length < count) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

      if (!numbers.includes(randomNumber)) {
         numbers.push(randomNumber);
      }
   }

   return numbers;
}
