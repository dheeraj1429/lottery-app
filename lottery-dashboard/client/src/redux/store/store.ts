import { configureStore } from '@reduxjs/toolkit';
import rolesSlice from '../features/roles/rolesSlice';

const store = configureStore({
   reducer: {
      [rolesSlice.name]: rolesSlice.reducer,
   },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
