export interface RolesResponse {
   item: { roleName: string; _id: string; createdAt: Date; default: boolean }[];
   success: boolean;
   error: boolean;
}
