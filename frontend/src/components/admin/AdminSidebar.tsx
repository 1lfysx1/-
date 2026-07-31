import { LayoutDashboard, Briefcase, MessageSquare, Users, LogOut, MessageCircle, TrendingUp } from "lucide-react";
import { useApp } from "../../contexts/useApp";

export type AdminTabKey = "dashboard" | "positions" | "community" | "feedback" | "users" | "scores";

interface AdminSidebarProps {
  activeTab: AdminTabKey;
  onTabChange: (tab: AdminTabKey) => void;
}

const tabs: { key: AdminTabKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "系统概览", icon: LayoutDashboard },
  { key: "positions", label: "岗位与知识库", icon: Briefcase },
  { key: "community", label: "社区管理", icon: MessageSquare },
  { key: "feedback", label: "反馈管理", icon: MessageCircle },
  { key: "users", label: "用户管理", icon: Users },
  { key: "scores", label: "成绩追踪", icon: TrendingUp },
];

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { logout } = useApp();

  return (
    <nav className="w-56 bg-white border-r border-gray-100 flex flex-col py-4">
      <div className="px-4 mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">管理后台</p>
      </div>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-3 mx-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-indigo-500" : "text-gray-400"}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
      <div className="mt-auto px-4">
        <button
          onClick={() => { logout(); window.location.hash = "#/login"; }}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>
    </nav>
  );
}


