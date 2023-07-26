import { createSlice } from '@reduxjs/toolkit';
import { StateProps } from '.';
import {
   createNewRoleHandler,
   getAllRoles,
   getSingleRole,
   updateRole,
} from './rolesAction';

const INITALSTATE: StateProps = {
   createNewRoleInfo: null,
   createNewRoleLoading: false,
   createNewRoleError: null,
   allRoles: null,
   allRolesLoading: false,
   allRolesError: null,
   singleRole: null,
   singleRoleLoading: false,
   singleRoleError: null,
   updateRoleInfo: null,
   updateRoleLoading: false,
};

const rolesSlice = createSlice({
   name: 'roles',
   initialState: INITALSTATE,
   reducers: {
      removeRolesErrors: (state) => {
         state.createNewRoleInfo = null;
         state.createNewRoleLoading = false;
         state.createNewRoleError = null;
      },
      removeUpdateRoleInfo: (state) => {
         state.updateRoleInfo = null;
         state.updateRoleLoading = false;
      },
   },
   extraReducers: (bulder) => {
      bulder
         .addCase(createNewRoleHandler.pending, (state) => {
            state.createNewRoleInfo = null;
            state.createNewRoleLoading = true;
            state.createNewRoleError = null;
         })
         .addCase(createNewRoleHandler.rejected, (state, action) => {
            state.createNewRoleInfo = null;
            state.createNewRoleLoading = false;
            state.createNewRoleError = action.payload;
         })
         .addCase(createNewRoleHandler.fulfilled, (state, action) => {
            state.createNewRoleInfo = action.payload;
            state.createNewRoleLoading = false;
            state.createNewRoleError = null;
         });

      bulder
         .addCase(getAllRoles.pending, (state) => {
            state.allRoles = null;
            state.allRolesLoading = true;
            state.allRolesError = null;
         })
         .addCase(getAllRoles.rejected, (state, action) => {
            state.allRoles = null;
            state.allRolesLoading = false;
            state.allRolesError = action.payload;
         })
         .addCase(getAllRoles.fulfilled, (state, action) => {
            state.allRoles = action.payload;
            state.allRolesLoading = false;
            state.allRolesError = null;
         });

      bulder
         .addCase(getSingleRole.pending, (state) => {
            state.singleRole = null;
            state.singleRoleLoading = true;
            state.singleRoleError = null;
         })
         .addCase(getSingleRole.rejected, (state, action) => {
            state.singleRole = null;
            state.singleRoleLoading = false;
            state.singleRoleError = action.payload;
         })
         .addCase(getSingleRole.fulfilled, (state, action) => {
            state.singleRole = action.payload;
            state.singleRoleLoading = false;
            state.singleRoleError = null;
         });

      bulder
         .addCase(updateRole.pending, (state) => {
            state.updateRoleInfo = null;
            state.updateRoleLoading = true;
            state.createNewRoleError = null;
         })
         .addCase(updateRole.rejected, (state, action) => {
            state.updateRoleInfo = null;
            state.updateRoleLoading = false;
            state.createNewRoleError = action.payload;
         })
         .addCase(updateRole.fulfilled, (state, action) => {
            state.updateRoleInfo = action.payload;
            state.updateRoleLoading = false;
            state.createNewRoleError = null;
         });
   },
});

export const { removeRolesErrors, removeUpdateRoleInfo } = rolesSlice.actions;

export default rolesSlice;
