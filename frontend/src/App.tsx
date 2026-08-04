import { useState, useEffect, useCallback } from "react";
import { AppProvider } from "./contexts/AppContext";
import { useApp } from "./contexts/useApp";
import LoginPage from "./pages/LoginPage";
import PositionSelectPage from "./pages/PositionSelectPage";
import CourseSelectPage from "./pages/CourseSelectPage";
import PretestPage from "./pages/PretestPage";
import LearningPage from "./pages/LearningPage";
import AdminPage from "./pages/AdminPage";

type Route = "login" | "positions" | "courses" | "pretest" | "learning" | "admin" | "notfound";

function Router() {
  const { isAuthenticated, selectedPosition, selectedCourse, user } = useApp();
  const [route, setRoute] = useState<Route>("login");

  // Parse hash on load and hash change
  const handleHashChange = useCallback(() => {
    const hashPath = window.location.hash.replace(/^#/, "");
    const path = (hashPath || window.location.pathname).split("?")[0] || "/login";

    if (path === "/login") setRoute("login");
    else if (path === "/positions") setRoute("positions");
    else if (path === "/courses") setRoute("courses");
    else if (path === "/pretest") setRoute("pretest");
    else if (path.startsWith("/learning")) setRoute("learning");
    else if (path.startsWith("/admin")) setRoute("admin");
    else setRoute("notfound");
  }, []);

  useEffect(() => {
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [handleHashChange]);

  // Auto-redirect based on auth state
  useEffect(() => {
    if (!isAuthenticated && route !== "login") {
      window.location.hash = "#/login";
    }
  }, [isAuthenticated, route]);

  // After login, restore the learner to the last meaningful place.
  useEffect(() => {
    if (!isAuthenticated || route !== "login") return;
    if (user?.role === "teacher" || user?.role === "admin") {
      window.location.hash = "#/admin?tab=dashboard";
      return;
    }
    if (selectedCourse) {
      window.location.hash = "#/learning?tab=qa";
      return;
    }
    window.location.hash = selectedPosition ? "#/courses" : "#/positions";
  }, [isAuthenticated, route, selectedCourse, selectedPosition, user]);

  // Give the hash router a valid entry point when the app opens at root.
  useEffect(() => {
    if (window.location.hash || !isAuthenticated) return;
    if (user?.role === "teacher" || user?.role === "admin") {
      window.location.hash = "#/admin?tab=dashboard";
    } else if (selectedCourse) {
      window.location.hash = "#/learning?tab=qa";
    } else {
      window.location.hash = selectedPosition ? "#/courses" : "#/positions";
    }
  }, [isAuthenticated, selectedCourse, selectedPosition, user]);

  // Auto-redirect teachers/admins to admin panel
  useEffect(() => {
    if (isAuthenticated && (user?.role === "teacher" || user?.role === "admin")) {
      const hashPath = window.location.hash.replace("#", "").split("?")[0];
      if (hashPath !== "/admin" && hashPath !== "/login") {
        window.location.hash = "#/admin?tab=dashboard";
      }
    }
  }, [isAuthenticated, user]);

  const navigateToCourses = () => { window.location.hash = "#/courses"; };
  const navigateToPretest = () => { window.location.hash = "#/pretest"; };
  const navigateToLearning = () => {
    window.location.hash = "#/learning?tab=qa";
  };
  const goBackToPositions = () => { window.location.hash = "#/positions"; };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  switch (route) {
    case "positions":
      return <PositionSelectPage onNext={navigateToCourses} />;
    case "courses":
      return <CourseSelectPage onNext={navigateToPretest} onBack={goBackToPositions} />;
    case "pretest":
      return <PretestPage onDone={navigateToLearning} onBack={navigateToCourses} />;
    case "learning":
      return <LearningPage />;
    case "admin":
      return <AdminPage />;
    default:
      if (!selectedPosition) {
        if (user?.role === "teacher" || user?.role === "admin") {
          window.location.hash = "#/admin?tab=dashboard";
        } else {
          window.location.hash = "#/positions";
        }
        return null;
      }
      window.location.hash = selectedCourse ? "#/learning?tab=qa" : "#/courses";
      return null;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}







