'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadReceiver, openModal } from '@/store/receiverSlice';
import ReceiverModal from '@/components/ReceiverModal';

const RECEIVER_ID = 'b1b2c3d4-0001-4000-8000-000000000001';

export default function ReceiversPage() {
  const dispatch = useAppDispatch();
  const { isModalOpen } = useAppSelector((state) => state.receiver);

  useEffect(() => {
    dispatch(loadReceiver(RECEIVER_ID));
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Receivers</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <button
          onClick={() => dispatch(openModal())}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors cursor-pointer"
        >
          View Receiver
        </button>
      </main>

      {/* Modal */}
      {isModalOpen && <ReceiverModal />}
    </div>
  );
}
