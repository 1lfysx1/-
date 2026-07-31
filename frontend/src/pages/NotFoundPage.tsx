import { useApp } from "../contexts/useApp";

export default function NotFoundPage() {
  const { isAuthenticated } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-gray-500 mb-6">页面不存在</p>
      <a
        href={isAuthenticated ? "#/positions" : "#/login"}
        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-all"
      >
        返回首页
      </a>
    </div>
  );
}