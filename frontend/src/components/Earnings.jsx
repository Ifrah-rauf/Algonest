import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function Earnings() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadEarnings() {
      if (!user?.uid) return;

      try {
        const res = await fetch("http://localhost:5000/api/teachers/earnings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });
        const body = await res.json();
        if (body.success) {
          setData(body.data);
        }
      } catch (error) {
        console.error("Failed to load earnings:", error);
      }
    }

    loadEarnings();
  }, [user?.uid]);

  const monthlyData = data?.monthlyData || [];
  const transactions = data?.recentTransactions || [];
  const maxEarnings = Math.max(...monthlyData.map((d) => d.earnings), 1);

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
                <p className="text-2xl font-bold text-gray-900">₹{(data?.yearlyTotal || 0).toLocaleString("en-IN")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>
                {data?.currentMonth?.change === null || data?.currentMonth?.change === undefined
                  ? "This month"
                  : `${data.currentMonth.change > 0 ? "+" : "-"}${Math.abs(data.currentMonth.change)}% from last month`}
              </span>
            </div>
          </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">₹{(data?.currentMonth?.earnings || 0).toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>
              {data?.currentMonth?.change === null || data?.currentMonth?.change === undefined
                ? `${data?.currentMonth?.bookings || 0} bookings this month`
                : `${data.currentMonth.change > 0 ? "+" : "-"}${Math.abs(data.currentMonth.change)}% from last month`}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Payout</p>
              <p className="text-2xl font-bold text-gray-900">₹{(data?.currentMonth?.earnings || 0).toLocaleString("en-IN")}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Current month total from booked students</p>
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
                    ₹{data.earnings.toLocaleString("en-IN")}
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
                    {transaction.student} • {new Date(transaction.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span className="font-bold text-green-600">₹{transaction.amount.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
