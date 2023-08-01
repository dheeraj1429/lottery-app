import { configureStore } from '@reduxjs/toolkit';
import clientSlice from '../features/client/userSlice';
import luckyDrawSlice from '../features/luckyDraw/luckyDrawSlice';

const store = configureStore({
   reducer: {
      [clientSlice.name]: clientSlice.reducer,
      [luckyDrawSlice.name]: luckyDrawSlice.reducer,
   },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
