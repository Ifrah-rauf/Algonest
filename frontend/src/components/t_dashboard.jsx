import { useState } from 'react';
import  Sidebar  from './Sidebar';
import { DashboardOverview } from './DashboardOverview';
import  MyRoadmaps  from './MyRoadmaps';
import { TeacherContent } from './TeacherContent';
import { Students } from './Students';
import { Earnings } from './Earnings';
import { EditAvailability } from './Editavailability';
import { TeacherEditProfile } from './TeacherEditProfile';
import { TeacherSettings } from './TeacherSettings';
export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'my-roadmaps':
        return <MyRoadmaps />;
      case 'content':
        return <TeacherContent />;
      case 'students':
        return <Students />;
      case 'earnings':
        return <Earnings />;
      case 'edit-avail':
        return <EditAvailability />;
      case 'edit-profile':
        return <TeacherEditProfile />;
      case 'settings':
        return <TeacherSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="
        min-h-screen
        w-full
        lg:ml-[10%]
        lg:w-[90%]
        overflow-y-auto
        px-4
        sm:px-6
        py-6
      ">
        <div className="mx-auto w-full max-w-7xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
