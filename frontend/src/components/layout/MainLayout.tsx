import Header from "./Header";
import Sidebar, { type TabKey } from "./Sidebar";
import type { ReactNode } from "react";

interface MainLayoutProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  children: ReactNode;
}

export default function MainLayout({ activeTab, onTabChange, children }: MainLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}



