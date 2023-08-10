import { createSlice } from '@reduxjs/toolkit';
import { StateProps } from '.';

const INITALSTATE: StateProps = {
   user: null,
   showSuccessPopUp: false,
   selectedTab: 'result',
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
      setSelectedTab: (state, action) => {
         state.selectedTab = action.payload;
      },
   },
});

export const { setUser, showAndHideSuccessPopUp, setSelectedTab } =
   clientSlice.actions;

export default clientSlice;
