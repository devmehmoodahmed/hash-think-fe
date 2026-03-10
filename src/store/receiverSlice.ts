import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchReceiver } from '@/lib/api';
import type { Receiver } from '@/types';

interface ReceiverState {
  data: Receiver | null;
  selectedCurrency: string;
  isModalOpen: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ReceiverState = {
  data: null,
  selectedCurrency: 'USD',
  isModalOpen: false,
  loading: false,
  error: null,
};

export const loadReceiver = createAsyncThunk(
  'receiver/load',
  async (id: string) => {
    return await fetchReceiver(id);
  },
);

const receiverSlice = createSlice({
  name: 'receiver',
  initialState,
  reducers: {
    setSelectedCurrency(state, action) {
      state.selectedCurrency = action.payload;
    },
    openModal(state) {
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadReceiver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadReceiver.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadReceiver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load receiver';
      });
  },
});

export const { setSelectedCurrency, openModal, closeModal } = receiverSlice.actions;
export default receiverSlice.reducer;
