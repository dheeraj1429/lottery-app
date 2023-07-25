import { createSlice } from '@reduxjs/toolkit';
import { StateProps } from '.';
import { createNewRoleHandler } from './rolesAction';

const INITALSTATE: StateProps = {
   createNewRoleInfo: null,
   createNewRoleLoading: false,
   createNewRoleError: null,
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
   },
});

export const { removeRolesErrors } = rolesSlice.actions;

export default rolesSlice;
