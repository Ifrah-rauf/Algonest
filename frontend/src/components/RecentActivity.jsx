import { CheckCircle, MessageCircle, Star, UserPlus } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'completion',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    message: 'Sarah completed "React Hooks" module',
    time: '5 min ago',
  },
  {
    id: 2,
    type: 'review',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    message: 'New 5-star review from Michael',
    time: '23 min ago',
  },
  {
    id: 3,
    type: 'enrollment',
    icon: UserPlus,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    message: '12 new students enrolled',
    time: '1 hour ago',
  },
  {
    id: 4,
    type: 'message',
    icon: MessageCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    message: 'Question in "Python Basics" forum',
    time: '2 hours ago',
  },
  {
    id: 5,
    type: 'completion',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    message: 'James finished entire roadmap',
    time: '3 hours ago',
  },
];

export function RecentActivity() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
