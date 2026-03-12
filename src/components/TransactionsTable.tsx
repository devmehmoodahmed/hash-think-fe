'use client';

import { useState, useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { getDownloadUrl } from '@/lib/api';
import Image from 'next/image';

const FLAG_MAP: Record<string, string> = {
  USD: '/usd.svg',
  IRR: '/irr.svg',
  INR: '/inr.png',
};

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
    return { dateFormatted: dateFormatted + ',', timeFormatted };
  };

  const formatAmount = (amount: number) => {
    const formatted = amount.toLocaleString();
    switch (selectedCurrency) {
      case 'USD':
        return `${formatted}$`;
      case 'IRR':
        return `${formatted} ﷼`;
      case 'INR':
        return `${formatted} ₹`;
      default:
        return formatted;
    }
  };

  return (
    <div className="flex flex-col min-h-0">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 shrink-0 flex-col md:flex-row gap-2">
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
            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full border border-gray-200 transition-colors">
            <svg
              className="w-4 h-4 text-[#526c66]"
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
        <div className="overflow-y-auto overflow-x-auto min-h-0 max-h-[230px]">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="md:min-w-[3%] w-[40px]" />
              <col className="md:min-w-[15%] w-[120px]" />
              <col className="md:min-w-[12%] w-[120px]" />
              <col className="md:min-w-[15%] w-[150px]" />
              <col className="md:min-w-[17%] w-[170px]" />
              <col className="md:min-w-[13%] w-[130px]" />
              <col className="md:min-w-[10%] w-[100px]" />
              <col className="md:min-w-[15%] w-[150px]" />
            </colgroup>
            <thead className="sticky top-0 bg-white">
              <tr className="text-center text-gray-400 text-xs">
                <th className="py-3 px-2 font-medium  border-b-2 border-gray-200">#</th>
                <th className="py-3 px-2 font-medium  border-b-2 border-gray-200 text-left">Reference<br/> number</th>
                <th className="py-3 px-2 font-medium  border-b-2 border-gray-200">To</th>
                <th className="py-3 px-2 font-medium  border-b-2 border-gray-200">Date &amp; Time</th>
                <th className="py-3 px-2 font-medium  border-b-2 border-gray-200">Paid with</th>
                <th className="py-3 px-2 font-medium  border-b-2 border-gray-200">Amount</th>
                <th className="py-3 px-2 font-medium  border-b-2 border-gray-200">Status</th>
                <th className="py-3 px-2 font-medium  border-b-2 border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="before:content-[''] before:block before:h-4 after:content-[''] after:block after:h-4">
              {filtered.map((tx, index) => {
                const { dateFormatted, timeFormatted } = formatDate(
                  tx.date_time,
                );
                return (
                  <tr
                    key={tx.id}
                    className={`border-b border-gray-100 text-center ${
                      index % 2 === 0 ? 'bg-[#f4f4f4]' : 'bg-white'
                    }`}
                  >
                    <td className="p-2 text-gray-400">{index + 1}</td>
                    <td className="p-2 text-gray-700">
                      {tx.reference_number}
                    </td>
                    <td className="p-2 text-gray-700">{tx.to}</td>
                    <td className="p-2 text-gray-700">
                      <div className='text-nowrap'>{dateFormatted}</div>
                      <div>{timeFormatted}</div>
                    </td>
                    <td className="p-2 text-gray-700">{tx.paid_with}</td>
                    <td className="p-2 font-medium text-gray-900">
                      <div className="flex items-center justify-center gap-1.5">
                        {FLAG_MAP[selectedCurrency] && (
                          <Image
                            src={FLAG_MAP[selectedCurrency]}
                            alt={selectedCurrency}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-cover rounded-full shrink-0"
                          />
                        )}
                        <span>{formatAmount(tx.amount)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                          tx.status === 'Approved'
                            ? 'text-green-700 bg-green-50'
                            : 'text-[#fec927] bg-[#fbf2e2]'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center gap-4">
                        <button className="text-[#5dc0fd] hover:underline text-sm font-medium">
                          View
                        </button>
                        <a
                          href={getDownloadUrl(tx.id)}
                          className="text-[#776733] underline text-sm font-medium"
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
