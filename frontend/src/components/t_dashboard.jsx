import { useState } from 'react';
import  Sidebar  from './Sidebar';
import { DashboardOverview } from './DashboardOverview';
import  MyRoadmaps  from './MyRoadmaps';
import { MarketplaceRoadmaps } from './MarketplaceRoadmaps';
import { Students } from './Students';
import { Earnings } from './Earnings';
import { EditAvailability } from './Editavailability';
export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'my-roadmaps':
        return <MyRoadmaps />;
      case 'marketplace':
        return <MarketplaceRoadmaps />;
      case 'students':
        return <Students />;
      case 'earnings':
        return <Earnings />;
      case 'edit-avail':
        return <EditAvailability />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex overflow-y-auto ml-[18%]">
        {renderContent()}
      </main>
    </div>
  );
}
