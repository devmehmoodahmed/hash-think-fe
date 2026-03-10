export interface Receiver {
  id: string;
  name: string;
  email: string;
  created_at: string;
  currencies?: Currency[];
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  flag_url: string;
  account_count: number;
}

export interface Transaction {
  id: string;
  receiver_id: string;
  currency_id: string;
  reference_number: string;
  to: string;
  date_time: string;
  paid_with: string;
  amount: number;
  status: 'Approved' | 'Pending';
  created_at: string;
}
