import { KnownError, ApiResponseInterface, ErrorType } from '@/types/interface';
interface CreateNewRolePayload {
   roleName: string;
   isDefault: boolean;
}
export interface CreateNewRolesResponseInterface extends ApiResponseInterface {
   message: string;
}
export interface GetRolesInterface extends ApiResponseInterface {
   items: {
      roleName: string;
      _id: string;
      createdAt: string;
      default: boolean;
   }[];
}
export interface SingleRoleApiPayload {
   roleId: string;
}
export interface GetSingleRoleInterface extends ApiResponseInterface {
   item: { isDefault: boolean; roleName: string };
}
export interface UpdateSingleRole extends CreateNewRolePayload {
   roleId: string;
}
export interface RolesWithIdsInterface extends ApiResponseInterface {
   items: { roleName: string; _id: string }[];
}
export interface GetRolesWithIdPayload {
   userId: string;
}
export interface StateProps {
   createNewRoleInfo: CreateNewRolesResponseInterface | null;
   createNewRoleLoading: boolean;
   createNewRoleError: ErrorType;
   allRoles: GetRolesInterface | null;
   allRolesLoading: boolean;
   allRolesError: ErrorType;
   singleRole: GetSingleRoleInterface | null;
   singleRoleLoading: boolean;
   singleRoleError: ErrorType;
   updateRoleInfo: CreateNewRolesResponseInterface | null;
   updateRoleLoading: boolean;
   allRolesWithIds: RolesWithIdsInterface | null;
   allRolesWithIdsLoading: boolean;
   allRolesWithIdsError: ErrorType;
}
