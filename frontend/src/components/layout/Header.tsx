import { useApp } from "../../contexts/useApp";
import { User } from "lucide-react";

export default function Header() {
  const { user, selectedPosition, selectedCourse } = useApp();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
            V
          </span>
          <span className="text-lg font-semibold text-gray-900 tracking-tight">技能培训系统</span>
        </div>
        {selectedPosition && selectedCourse && (
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200 text-sm text-gray-500">
            <span className="text-orange-500 font-medium">{selectedPosition.name}</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700">{selectedCourse.name}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <span className="font-medium">{user?.username || "用户"}</span>
        </div>

      </div>
    </header>
  );
}



