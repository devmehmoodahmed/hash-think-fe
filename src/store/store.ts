import { configureStore } from '@reduxjs/toolkit';
import receiverReducer from './receiverSlice';
import transactionsReducer from './transactionsSlice';

export const store = configureStore({
  reducer: {
    receiver: receiverReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
