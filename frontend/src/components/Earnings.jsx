import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', earnings: 6200 },
  { month: 'Feb', earnings: 6800 },
  { month: 'Mar', earnings: 7200 },
  { month: 'Apr', earnings: 7800 },
  { month: 'May', earnings: 8450 },
];

const transactions = [
  {
    id: 1,
    roadmap: 'Full Stack Web Development',
    date: '2026-01-30',
    amount: '$2,450',
    students: 50,
  },
  {
    id: 2,
    roadmap: 'React & TypeScript Mastery',
    date: '2026-01-29',
    amount: '$1,890',
    students: 45,
  },
  {
    id: 3,
    roadmap: 'Python Data Science Path',
    date: '2026-01-28',
    amount: '$1,620',
    students: 30,
  },
  {
    id: 4,
    roadmap: 'Mobile App Development',
    date: '2026-01-27',
    amount: '$1,080',
    students: 25,
  },
  {
    id: 5,
    roadmap: 'Full Stack Web Development',
    date: '2026-01-26',
    amount: '$1,410',
    students: 32,
  },
];

export function Earnings() {
  const maxEarnings = Math.max(...monthlyData.map((d) => d.earnings));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Earnings</h2>
        <p className="text-gray-600 mt-2">Track your revenue and payouts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">$36,450</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+18% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">$8,450</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+23% from April</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Payout</p>
              <p className="text-2xl font-bold text-gray-900">$8,450</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Due on Feb 15, 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Earnings</h3>
          <div className="space-y-4">
            {monthlyData.map((data) => (
              <div key={data.month}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{data.month}</span>
                  <span className="text-sm font-bold text-gray-900">
                    ${data.earnings.toLocaleString()}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-purple-400 h-3 rounded-full"
                    style={{ width: `${(data.earnings / maxEarnings) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0"
              >
                <div>
                  <p className="font-semibold text-gray-900">{transaction.roadmap}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {transaction.students} students • {transaction.date}
                  </p>
                </div>
                <span className="font-bold text-green-600">{transaction.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
