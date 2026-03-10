'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  updateTransactionStatus,
  addTransaction,
} from '@/store/transactionsSlice';
import type { Transaction } from '@/types';

export default function SocketListener() {
  const dispatch = useAppDispatch();
  const { selectedCurrency } = useAppSelector((state) => state.receiver);

  useEffect(() => {
    const socket = getSocket();

    socket.on(
      'transaction:statusUpdated',
      (data: { id: string; status: 'Approved' | 'Pending' }) => {
        dispatch(updateTransactionStatus({ id: data.id, status: data.status }));
      },
    );

    socket.on('transaction:new', (data: Transaction) => {
      dispatch(addTransaction(data));
    });

    return () => {
      socket.off('transaction:statusUpdated');
      socket.off('transaction:new');
    };
  }, [dispatch, selectedCurrency]);

  return null;
}
