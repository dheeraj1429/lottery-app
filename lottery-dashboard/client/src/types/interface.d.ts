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
export type ErrorResponseType = AxiosError<KnownError>;
export type ErrorType = KnownError | null | undefined;
export interface PaginationResponse {
   totalDocuments?: number;
   totalPages: number;
   page: number;
}
