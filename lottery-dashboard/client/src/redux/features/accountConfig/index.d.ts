import { ApiResponseInterface, ErrorType } from '@/types/interface';

export interface AccountConfig {
   clientId: string;
   _id: string;
   userInfoApi: string;
   updateClientInformationApi: string;
}
export interface AccountConfigResponse extends ApiResponseInterface {
   userConfigInfo: AccountConfig;
}
export interface AccountConfigPayload {
   userId: string;
}
export interface UpdateUserAccountConfigPayload {
   userId: string;
   userInfoApi: string;
   clientId: string;
   updateClientInformationApi: string;
}
export interface updateUserAccountConfigResponse extends ApiResponseInterface {
   message: string;
}
export interface AccountState {
   accountConfigInfo: AccountConfigResponse | null;
   accountConfigLoading: boolean;
   acocuntConfigError: ErrorType;
   accountConfigUpdateInfo: updateUserAccountConfigResponse | null;
   accountConfigUpdateLoading: boolean;
   accountConfigUpdateError: ErrorType;
}
