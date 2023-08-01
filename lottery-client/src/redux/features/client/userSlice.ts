import { createSlice } from '@reduxjs/toolkit';
import { StateProps } from '.';

const INITALSTATE: StateProps = {
   user: null,
};

const clientSlice = createSlice({
   name: 'client',
   initialState: INITALSTATE,
   reducers: {
      setUser: (state, action) => {
         state.user = action.payload;
      },
   },
   extraReducers: (bulder) => {},
});

export const { setUser } = clientSlice.actions;

export default clientSlice;
