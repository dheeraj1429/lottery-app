import mongoose from 'mongoose';

/**
 * @responseObject function is a utility function used to generate a custom response
 * object with specific properties. This function is designed to provide a consistent
 * format for returning responses from various parts of the application. It can be used in
 * controllers, services, or other modules to create response objects with standardized
 * properties, such as success status, error status, and additional options.
 * @success ( boolean ): A boolean value representing the success status of the
 * response. If true, it indicates that the operation was successful; if false,
 * it indicates that there was an error or the operation was not successful.
 * @error ( boolean ): A boolean value representing the error status of the response.
 * If true, it indicates that an error occurred; if false, it indicates that there were
 * no errors.
 * @options ( object ): An optional parameter that allows additional properties or data to
 * be included in the response object. This can be used to add extra information or custom
 * data to the response.
 */
export const responseObject = function (
   success: boolean,
   error: boolean,
   options?: any,
) {
   return { success, error, ...options };
};

/**
 * @checkIsValidId function is a utility function used to validate a MongoDB ObjectID string.
 * It utilizes the mongoose.isValidObjectId method to check whether the provided ID is a
 * valid MongoDB ObjectID. This function is commonly used in applications with a MongoDB
 * database to ensure that the provided ID is in the correct format and can be used for
 * database operations.
 * @id ( string ) The MongoDB ObjectID string that needs to be validated.
 * @returns { boolean } The function returns a boolean value, true if the provided ID is a
 * valid MongoDB ObjectID, and false if it is not valid.
 */
export const checkIsValidId = function (id: string): boolean {
   const isValidId = mongoose.isValidObjectId(id);
   return isValidId;
};

/**
 * @validateObject function is a utility function used to validate the properties of an
 * object against a list of required properties. This function is commonly used to ensure
 * that an object contains all the necessary properties before performing specific
 * operations, such as API response handling or data processing.
 * @obj ( any Object ) The object that needs to be validated. It can be any
 * JavaScript object containing properties.
 * @requiredProperties ( string[] ): An array of strings representing the names of the
 * properties that are required in the object.
 * @return { error: string } The function returns an object with a single property error.
 * If all the required properties are present in the obj, error will be null, indicating
 * that the object is valid. If any of the required properties are missing, error will
 * be a string containing an error message indicating which property is missing.
 */
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

/**
 * @generateUniqueRandomNumbers function is a utility function used to generate a specified
 * number of unique random integers within a given range. It ensures that the generated
 * random numbers are distinct and unique. This function is commonly used in scenarios
 * where a set of unique random values is required, such as generating unique IDs or random
 * samples.
 * @count ( number ) The number of unique random integers to be generated.
 * @min ( number ): The minimum value of the range from which the random numbers should be selected (inclusive).
 * @max ( number ): The maximum value of the range from which the random numbers should be selected (inclusive).
 * @returns number[]: The function returns an array containing count unique random integers between the specified min and max (inclusive).
 */
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
