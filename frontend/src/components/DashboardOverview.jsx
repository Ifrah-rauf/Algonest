import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { RecentActivity } from './RecentActivity';
import { ActiveRoadmaps } from './ActiveRoadmaps';
import { useAuth } from '../context/AuthContext';
export function DashboardOverview() {
  const {user} = useAuth();
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, Professor {user.username}!</h2>
        <p className="text-gray-600 mt-2">Here's what's happening with your courses today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value="1,248"
          change="+12%"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Active Roadmaps"
          value="18"
          change="+3"
          icon={BookOpen}
          color="yellow"
        />
        <StatCard
          title="Monthly Earnings"
          value="$8,450"
          change="+23%"
          icon={DollarSign}
          color="purple"
        />
        <StatCard
          title="Completion Rate"
          value="78%"
          change="+5%"
          icon={TrendingUp}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActiveRoadmaps />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
