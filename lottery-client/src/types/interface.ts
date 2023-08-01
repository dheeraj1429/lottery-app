import { AxiosError } from 'axios';
export interface ApiResponseInterface {
   success: boolean;
   error: boolean;
}
export interface KnownError {
   message: string[] | string;
   error?: string;
   statusCode?: string;
}
export interface InterigationApiResponse extends ApiResponseInterface {
   message?: string;
   token: string;
   user: {
      userId: string;
      name: string;
      avatar: string;
      amountInUsd: number;
   };
}
export type ErrorResponseType = AxiosError<KnownError>;
export type ErrorType = KnownError | null | undefined;
