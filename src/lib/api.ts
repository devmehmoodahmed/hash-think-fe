const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchReceivers() {
  const res = await fetch(`${API_URL}/receivers`);
  if (!res.ok) throw new Error('Failed to fetch receivers');
  return res.json();
}

export async function fetchReceiver(id: string) {
  const res = await fetch(`${API_URL}/receivers/${id}`);
  if (!res.ok) throw new Error('Failed to fetch receiver');
  return res.json();
}

export async function fetchTransactions(receiverId: string, currency: string) {
  const res = await fetch(
    `${API_URL}/transactions?receiverId=${receiverId}&currency=${currency}`,
  );
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export function getDownloadUrl(transactionId: string) {
  return `${API_URL}/transactions/download/${transactionId}`;
}
