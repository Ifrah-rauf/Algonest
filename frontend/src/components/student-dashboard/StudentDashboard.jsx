import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  buildActivityItems,
  buildRoadmaps,
  buildRoadmapActivityState,
  buildStudentProfile,
} from "./dataBuilders";
import useStudentDashboardData from "./useStudentDashboardData";
import ActivityTab from "./ActivityTab";
import ExploreProjectsTab from "./ExploreProjectsTab";
import ProfileHeader from "./ProfileHeader";
import ProfileTab from "./ProfileTab";
import RightSidebar from "./RightSidebar";
import { AppShell, ErrorBanner, LoadingSkeleton, TabButton } from "./ui";
import "../../styles/student-dashboard.css";

export default function StudentDashboard({ data: propData }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("activity");

  const {
    dashboardData,
    sessionInfo,
    mentorSuggestions,
    projectSuggestions,
    courseAds,
    projectsLoading,
    dashboardLoading,
    dashboardError,
    loadDashboard,
    handleProfileSave,
  } = useStudentDashboardData({ propData, user });

  const student = useMemo(() => buildStudentProfile(dashboardData, user), [dashboardData, user]);
  const roadmaps = useMemo(() => buildRoadmaps(dashboardData), [dashboardData]);
  const roadmapState = useMemo(() => buildRoadmapActivityState(dashboardData), [dashboardData]);
  const activityItems = useMemo(
    () => buildActivityItems(dashboardData, sessionInfo),
    [dashboardData, sessionInfo]
  );

  const handleChooseRoadmap = () => {
    setActiveTab("activity");
    navigate("/roadmaps");
  };

  if (dashboardLoading) return <LoadingSkeleton />;

  return (
    <AppShell>
      {dashboardError ? <ErrorBanner message={dashboardError} onRetry={loadDashboard} /> : null}

      <div>
        <div className="px-3 py-4 sm:px-5 sm:py-6 md:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:gap-6">
            <div className="min-w-0 space-y-5">
              <div className="flex min-w-0 items-center gap-3 text-[var(--dash-ink)]">
                <button
                  type="button"
                  className="shrink-0 rounded-full p-1 text-[var(--dash-muted)] transition hover:bg-black/5"
                  onClick={() => navigate(-1)}
                  aria-label="Go back"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <div className="min-w-0 truncate text-xl font-bold tracking-tight sm:text-2xl">
                  {student.name}
                </div>
              </div>

              <ProfileHeader
                student={student}
                activeCourse={dashboardData?.activeCourse}
                onMentorClick={() => navigate("/teachers")}
                onProfileSave={handleProfileSave}
              />

              <div className="overflow-x-auto border-b border-[var(--dash-border)]">
                <div className="flex min-w-max gap-1">
                  <TabButton
                    active={activeTab === "activity"}
                    onClick={() => setActiveTab("activity")}
                  >
                    Activity
                  </TabButton>
                  <TabButton
                    active={activeTab === "profile"}
                    onClick={() => setActiveTab("profile")}
                  >
                    Profile
                  </TabButton>
                  <TabButton
                    active={activeTab === "explore"}
                    onClick={() => setActiveTab("explore")}
                  >
                    Explore Projects
                  </TabButton>
                </div>
              </div>

              {activeTab === "activity" ? (
                <ActivityTab
                  data={dashboardData}
                  sessionInfo={sessionInfo}
                  roadmapState={roadmapState}
                  roadmaps={roadmaps}
                  activityItems={activityItems}
                  navigate={navigate}
                  onChooseRoadmap={handleChooseRoadmap}
                />
              ) : null}
              {activeTab === "profile" ? (
                <ProfileTab
                  student={student}
                  data={dashboardData}
                  navigate={navigate}
                  onProfileSave={handleProfileSave}
                />
              ) : null}
              {activeTab === "explore" ? (
                <ExploreProjectsTab
                  projects={projectSuggestions}
                  navigate={navigate}
                  loading={projectsLoading}
                />
              ) : null}
            </div>

            <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
              <RightSidebar
                activeCourse={dashboardData?.activeCourse}
                courses={courseAds}
                mentors={mentorSuggestions}
                projectSuggestions={projectSuggestions}
                navigate={navigate}
              />
            </aside>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
