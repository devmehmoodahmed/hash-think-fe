import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTransactions } from '@/lib/api';
import type { Transaction } from '@/types';

interface TransactionsState {
  data: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  data: [],
  loading: false,
  error: null,
};

export const loadTransactions = createAsyncThunk(
  'transactions/load',
  async ({ receiverId, currency }: { receiverId: string; currency: string }) => {
    return await fetchTransactions(receiverId, currency);
  },
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    updateTransactionStatus(
      state,
      action: PayloadAction<{ id: string; status: 'Approved' | 'Pending' }>,
    ) {
      const tx = state.data.find((t) => t.id === action.payload.id);
      if (tx) {
        tx.status = action.payload.status;
      }
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.data.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load transactions';
      });
  },
});

export const { updateTransactionStatus, addTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
