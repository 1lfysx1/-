import { useState, useEffect, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import type { TabKey } from "../components/layout/Sidebar";
import ChatView from "../components/rag/ChatView";
import PracticalView from "../components/practical/PracticalView";
import ExerciseView from "../components/exercise/ExerciseView";
import PersonalCenterView from "../components/personal/PersonalCenterView";
import CommunityView from "../components/community/CommunityView";
import WrongQuestionsView from "../components/personal/WrongQuestionsView";
import LearningPlatformView from "../components/learning/LearningPlatformView";
import FeedbackView from "../components/learning/FeedbackView";

function getTabFromHash(): TabKey {
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  return (params.get("tab") as TabKey) || "qa";
}

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState<TabKey>(getTabFromHash);

  const handleHashChange = useCallback(() => {
    setActiveTab(getTabFromHash());
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [handleHashChange]);

  const handleTabChange = (tab: TabKey) => {
    window.location.hash = `#/learning?tab=${tab}`;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "qa": return <ChatView />;
      case "practical": return <PracticalView />;
      case "exercise": return <ExerciseView />;
      case "profile": return <PersonalCenterView />;
      case "wrong": return <WrongQuestionsView />;
      case "learn": return <LearningPlatformView />;
      case "feedback": return <FeedbackView />;
      case "community": return <CommunityView />;
      default: return <ChatView />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="h-full animate-fade-in" key={activeTab}>
        {renderContent()}
      </div>
    </MainLayout>
  );
}


