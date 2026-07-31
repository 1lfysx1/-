import { useState, useEffect, useCallback } from "react";
import { useApp } from "../contexts/useApp";
import AdminSidebar, { type AdminTabKey } from "../components/admin/AdminSidebar";
import DashboardPanel from "../components/admin/DashboardPanel";
import PositionsPanel from "../components/admin/PositionsPanel";
import CommunityPanel from "../components/admin/CommunityPanel";
import UsersPanel from "../components/admin/UsersPanel";
import FeedbackPanel from "../components/admin/FeedbackPanel";
import ScoresPanel from "../components/admin/ScoresPanel";

function getTabFromHash(): AdminTabKey {
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const tab = params.get("tab");
  const validTabs: AdminTabKey[] = ["dashboard", "positions", "community", "feedback", "users", "scores"];
  return validTabs.includes(tab as AdminTabKey) ? (tab as AdminTabKey) : "dashboard";
}

export default function AdminPage() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTabKey>(getTabFromHash);

  const handleHashChange = useCallback(() => {
    setActiveTab(getTabFromHash());
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [handleHashChange]);

  const handleTabChange = (tab: AdminTabKey) => {
    window.location.hash = `#/admin?tab=${tab}`;
  };



  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardPanel />;
      case "positions": return <PositionsPanel />;
      case "community": return <CommunityPanel />;
      case "users": return <UsersPanel />;
      case "feedback": return <FeedbackPanel />;
      case "scores": return <ScoresPanel />;
      default: return <DashboardPanel />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">A</div>
          <span className="text-lg font-semibold text-gray-900 tracking-tight">管理后台</span>
          <span className="text-xs text-gray-400 ml-2 bg-gray-100 px-2 py-0.5 rounded-full">{user?.username} · {user?.role === "teacher" ? "教师" : "管理员"}</span>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="h-full animate-fade-in" key={activeTab}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}




