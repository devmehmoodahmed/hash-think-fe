'use client';

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/receiverSlice';
import { loadTransactions } from '@/store/transactionsSlice';
import CurrencySelector from './CurrencySelector';
import TransactionsTable from './TransactionsTable';
import SocketListener from './SocketListener';

export default function ReceiverModal() {
  const dispatch = useAppDispatch();
  const { data: receiver, selectedCurrency } = useAppSelector(
    (state) => state.receiver,
  );

  const loadTx = useCallback(() => {
    if (receiver?.id) {
      dispatch(
        loadTransactions({
          receiverId: receiver.id,
          currency: selectedCurrency,
        }),
      );
    }
  }, [dispatch, receiver?.id, selectedCurrency]);

  useEffect(() => {
    loadTx();
  }, [loadTx]);

  if (!receiver) return null;

  const createdDate = new Date(receiver.created_at).toLocaleDateString(
    'en-US',
    { day: '2-digit', month: 'short', year: 'numeric' },
  );

  return (
    <>
      <SocketListener />
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => dispatch(closeModal())}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {receiver.name}
                </h2>
                <span className="text-teal-600 text-sm font-medium cursor-pointer hover:underline">
                  Send Them Money →
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">{receiver.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => dispatch(closeModal())}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Currencies */}
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-600 mb-3">Currencies they use:</p>
            <CurrencySelector currencies={receiver.currencies || []} />
          </div>

          {/* Transactions */}
          <div className="px-6 pb-4">
            <TransactionsTable receiverName={receiver.name} />
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <p className="text-sm text-gray-400">
              You&apos;ve created this customer on {createdDate}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
