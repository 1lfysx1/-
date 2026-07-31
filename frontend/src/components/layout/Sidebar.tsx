import { BookOpen, MessageSquare, Wrench, FileText, User, Users, AlertCircle, MessageCircle, ArrowLeft, LogOut } from "lucide-react";
import { useApp } from "../../contexts/useApp";

export type TabKey = "learn" | "qa" | "practical" | "exercise" | "wrong" | "profile" | "community" | "feedback";

interface SidebarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string; icon: typeof BookOpen }[] = [
  { key: "learn", label: "学习平台", icon: BookOpen },
  { key: "qa", label: "智能问答", icon: MessageSquare },
  { key: "practical", label: "实操指导", icon: Wrench },
  { key: "exercise", label: "模拟练习", icon: FileText },
  { key: "wrong", label: "错题本", icon: AlertCircle },
  { key: "profile", label: "个人中心", icon: User },
  { key: "community", label: "社区问答", icon: Users },
  { key: "feedback", label: "意见反馈", icon: MessageCircle },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { logout } = useApp();
  return (
    <nav className="w-56 bg-white border-r border-gray-100 flex flex-col py-4">
      <div className="px-4 mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">学习工具</p>
      </div>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-3 mx-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-orange-50 text-orange-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-orange-500" : "text-gray-400"}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
      <div className="mt-auto px-4 pt-4 border-t border-gray-50 space-y-1">
        <button
          onClick={() => { window.location.hash = "#/positions"; }}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-orange-500 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回选职业</span>
        </button>
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






