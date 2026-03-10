'use client';

import { useState, useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { getDownloadUrl } from '@/lib/api';

interface TransactionsTableProps {
  receiverName: string;
}

export default function TransactionsTable({
  receiverName,
}: TransactionsTableProps) {
  const { data: transactions, loading } = useAppSelector(
    (state) => state.transactions,
  );
  const { selectedCurrency } = useAppSelector((state) => state.receiver);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Client-side search filtering by "To" and "Status"
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.to.toLowerCase().includes(q) ||
        tx.status.toLowerCase().includes(q),
    );
  }, [transactions, searchQuery]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dateFormatted = date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeFormatted = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return { dateFormatted, timeFormatted };
  };

  const formatAmount = (amount: number) => {
    const symbols: Record<string, string> = {
      USD: '$',
      IRR: '﷼',
      INR: '₹',
    };
    const symbol = symbols[selectedCurrency] || '';
    return `${symbol} ${amount.toLocaleString()}`;
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          Transactions History With {receiverName.split(' ')[0]}
        </h3>
        <div className="flex items-center gap-2">
          {showSearch && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or status..."
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-48 sm:w-64"
              autoFocus
            />
          )}
          <button
            onClick={() => {
              setShowSearch(!showSearch);
              if (showSearch) setSearchQuery('');
            }}
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
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
                d="M7 17L17 7M17 7H7M17 7V17"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-3 pr-2 font-medium">#</th>
                <th className="py-3 px-2 font-medium">Reference number</th>
                <th className="py-3 px-2 font-medium">To</th>
                <th className="py-3 px-2 font-medium">Date & Time</th>
                <th className="py-3 px-2 font-medium">Paid with</th>
                <th className="py-3 px-2 font-medium">Amount</th>
                <th className="py-3 px-2 font-medium">Status</th>
                <th className="py-3 pl-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx, index) => {
                const { dateFormatted, timeFormatted } = formatDate(
                  tx.date_time,
                );
                return (
                  <tr
                    key={tx.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 pr-2 text-gray-500">{index + 1}</td>
                    <td className="py-4 px-2 text-gray-700">
                      {tx.reference_number}
                    </td>
                    <td className="py-4 px-2 text-gray-700">{tx.to}</td>
                    <td className="py-4 px-2 text-gray-700">
                      <div>{dateFormatted}</div>
                      <div className="text-gray-400 text-xs">
                        {timeFormatted}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-gray-700">{tx.paid_with}</td>
                    <td className="py-4 px-2 font-medium text-gray-900">
                      {formatAmount(tx.amount)}
                    </td>
                    <td className="py-4 px-2">
                      <span
                        className={`text-sm font-medium ${
                          tx.status === 'Approved'
                            ? 'text-green-600'
                            : 'text-amber-500'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <button className="text-teal-600 hover:underline text-sm font-medium">
                          View
                        </button>
                        <a
                          href={getDownloadUrl(tx.id)}
                          className="text-red-500 hover:underline text-sm font-medium"
                        >
                          Download
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
