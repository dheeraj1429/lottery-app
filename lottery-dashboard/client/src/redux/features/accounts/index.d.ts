import { ApiResponseInterface, ErrorType } from '@/types/interface';

export interface GetAllAccountsParamInterface {
   userId: string;
   page: number;
}
export interface GetAllAccountInterface extends ApiResponseInterface {
   items: {
      email: string;
      avatar: string;
      accountEnable: boolean;
      createdAt: 1;
      _id: string;
   }[];
   page: number;
   totalDocuments: number;
   totalPages: number;
}
export interface CreateNewAccountInterface {
   email: string;
   accountEnable: boolean | undefined;
   role: string;
   userId: string;
}
export interface CreateNewAccountResponseInterface
   extends ApiResponseInterface {
   message: string;
}
export interface GetSingleProps {
   userId: string;
}
export interface GetSingleAccountResponse extends ApiResponseInterface {
   item: { email: string; accountEnable: boolean; roleId: string; _id: string };
}
export interface UpdateAccountInterface {
   email: string;
   accountEnable: boolean | undefined;
   role: string;
   _id: string;
}
export interface updateAccountPasswordInterface {
   password: string;
   userId: string;
}
export interface StateInterface {
   allAccounts: GetAllAccountInterface | null;
   allAccountsLoading: boolean;
   allAccountsError: ErrorType;
   createNewAccountInfo: CreateNewAccountResponseInterface | null;
   createNewAccountLoading: boolean;
   createNewAccountError: ErrorType;
   singleAccount: GetSingleAccountResponse | null;
   singleAccountLoading: boolean;
   accountUpdateLoading: boolean;
   updatePasswordInfo: CreateNewAccountResponseInterface | null;
   updatePasswordInfoLoading: boolean;
   updatePasswordError: ErrorType;
}
