import { configureStore } from '@reduxjs/toolkit';
import rolesSlice from '../features/roles/rolesSlice';
import accountSlice from '../features/accounts/accountSlice';
import accountConfigSlice from '../features/accountConfig/accountConfigSlice';
import luckyDrawSlice from '../features/luckyDraw/luckyDrawSlice';

const store = configureStore({
   reducer: {
      [rolesSlice.name]: rolesSlice.reducer,
      [accountSlice.name]: accountSlice.reducer,
      [accountConfigSlice.name]: accountConfigSlice.reducer,
      [luckyDrawSlice.name]: luckyDrawSlice.reducer,
   },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
