import { KnownError, ApiResponseInterface, ErrorType } from '@/types/interface';
interface CreateNewRolePayload {
   roleName: string;
   isDefault: boolean;
}
export interface CreateNewRolesResponseInterface extends ApiResponseInterface {
   message: string;
}
export interface StateProps {
   createNewRoleInfo: CreateNewRolesResponseInterface | null;
   createNewRoleLoading: boolean;
   createNewRoleError: ErrorType;
}
