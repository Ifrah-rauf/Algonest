import { TrendingUp, Award, Target, Zap } from 'lucide-react';

export function ProgressOverview() {
  const stats = [
    {
      id: '1',
      label: 'Overall Progress',
      value: '68%',
      change: '+12%',
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    // {
    //   id: '2',
    //   label: 'Completed Sessions',
    //   value: '24',
    //   change: '+4 this week',
    //   icon: Award,
    //   color: 'yellow',
    //   bgColor: 'bg-yellow-100',
    //   textColor: 'text-yellow-600'
    // },
    // {
    //   id: '3',
    //   label: 'Learning Streak',
    //   value: '15 days',
    //   change: 'Keep it up!',
    //   icon: Zap,
    //   color: 'purple',
    //   bgColor: 'bg-purple-100',
    //   textColor: 'text-purple-600'
    // },
    {
      id: '4',
      label: 'Lessons Completed',
      value: '8/12',
      change: '4 remaining',
      icon: Target,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={stat.textColor} size={24} />
              </div>
              <span className="text-xs text-green-600 font-medium">{stat.change}</span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
