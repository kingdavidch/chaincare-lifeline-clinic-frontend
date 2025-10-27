export const dummyWithdrawals = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  date: `2024-07-${String(31 - (index % 30)).padStart(2, '0')}`,
  amount: `${(Math.random() * 500).toFixed(2)} RWF`,
  status: ['Completed', 'Processing', 'Failed'][Math.floor(Math.random() * 3)],
}));
