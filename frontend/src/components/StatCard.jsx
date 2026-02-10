import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: 'purple' | 'yellow';
}

export function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const bgColor = color === 'purple' ? 'bg-purple-100' : 'bg-yellow-100';
  const iconColor = color === 'purple' ? 'text-purple-600' : 'text-yellow-600';
  const changeColor = change.startsWith('+') ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <span className={`text-sm font-semibold ${changeColor}`}>{change}</span>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
