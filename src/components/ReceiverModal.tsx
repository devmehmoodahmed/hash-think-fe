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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between px-8 pt-8 pb-4 shrink-0">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {receiver.name}
                </h2>
                  <div className="text-[#776733] font-semibold text-sm font-medium cursor-pointer flex gap-1">
                    <span className='underline'>Send Them Money</span> 
       
                      <svg className='inline' width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="#776733" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                  </div>
              </div>
              <p className="text-gray-500 text-sm mt-1">{receiver.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full border border-gray-200 transition-colors">
                <svg
                  className="w-5 h-5 text-[#526c66]"
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
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full border border-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-[#526c66]"
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
          <div className="px-8 pb-6 shrink-0">
            <p className="text-sm text-gray-600 mb-3">Currencies they use:</p>
            <CurrencySelector currencies={receiver.currencies || []} />
          </div>

          {/* Transactions — this section scrolls */}
          <div className="px-8 pb-4 min-h-0 flex-1 flex flex-col">
            <TransactionsTable receiverName={receiver.name} />
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 shrink-0">
            <p className="text-sm text-gray-400  border-t border-gray-200">
              You&apos;ve created this customer on {createdDate}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
