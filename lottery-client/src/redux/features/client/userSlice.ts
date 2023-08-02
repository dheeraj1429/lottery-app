import { createSlice } from '@reduxjs/toolkit';
import { StateProps } from '.';

const INITALSTATE: StateProps = {
   user: null,
   showSuccessPopUp: false,
};

const clientSlice = createSlice({
   name: 'client',
   initialState: INITALSTATE,
   reducers: {
      setUser: (state, action) => {
         state.user = action.payload;
      },
      showAndHideSuccessPopUp: (state, action) => {
         state.showSuccessPopUp = action.payload;
      },
   },
   extraReducers: (bulder) => {},
});

export const { setUser, showAndHideSuccessPopUp } = clientSlice.actions;

export default clientSlice;
