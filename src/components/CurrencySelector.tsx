'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedCurrency } from '@/store/receiverSlice';
import type { Currency } from '@/types';
import Image from 'next/image';

interface CurrencySelectorProps {
  currencies: Currency[];
}

export default function CurrencySelector({
  currencies,
}: CurrencySelectorProps) {
  const dispatch = useAppDispatch();
  const { selectedCurrency } = useAppSelector((state) => state.receiver);

  return (
    <div className="flex gap-3 flex-wrap">
      {currencies.map((currency) => {
        const isSelected = currency.code === selectedCurrency;
        return (
          <button
            key={currency.id}
            onClick={() => dispatch(setSelectedCurrency(currency.code))}
            className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-lg border-2 transition-all cursor-pointer ${
              isSelected
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={currency.flag_url}
                alt={currency.code}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`text-sm font-bold ${isSelected ? 'text-teal-700' : 'text-gray-700'}`}
            >
              {currency.code}
            </span>
            <span className="text-xs text-gray-500">
              {currency.account_count}{' '}
              {currency.account_count === 1 ? 'Account' : 'Accounts'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
