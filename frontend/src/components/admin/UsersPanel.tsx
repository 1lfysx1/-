import { useState, useEffect } from "react";
import { Trash2, Ban, Loader2, Search, User, RotateCcw } from "lucide-react";
import { useApp } from "../../contexts/useApp";
import { api, type User as UserType } from "../../mock/api";

export default function UsersPanel() {
  const { user: currentUser } = useApp();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "banned" | "cancelled">("all");
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try { setUsers(await api.admin.getUsers()); } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: string) => {
    const targetUser = users.find((item) => item.id === id);
    if (targetUser?.accountStatus === "cancelled") {
      alert("该用户已注销，不能封禁或删除");
      return;
    }
    if (currentUser?.id === id) {
      alert("不能删除当前登录账号");
      return;
    }
    if (!confirm("确认删除用户？此操作不可恢复！")) return;
    await api.admin.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleToggleStatus = async (user: UserType) => {
    if (user.accountStatus === "cancelled") {
      alert("该用户已注销，不能解封");
      return;
    }
    const isActive = user.accountStatus ? user.accountStatus === "active" : user.isActive !== false;
    if (currentUser?.id === user.id && isActive) {
      alert("管理员不能封禁自己");
      return;
    }
    const nextActive = !isActive;
    if (!nextActive && !confirm(`确认封禁 ${user.username}？`)) return;
    setSavingId(user.id);
    try {
      const result = await api.admin.setUserStatus(user.id, nextActive);
      setUsers((prev) => prev.map((item) => (
        item.id === user.id
          ? { ...item, isActive: nextActive, accountStatus: result.data?.accountStatus ?? (nextActive ? "active" : "banned") }
          : item
      )));
      alert(nextActive ? "已解封该用户" : "已封禁该用户");
    } finally {
      setSavingId(null);
    }
  };

  const handleRestore = async (user: UserType) => {
    if (user.accountStatus !== "cancelled") return;
    if (!confirm(`确认找回 ${user.username} 的注销账号？找回后该账号可以重新登录。`)) return;
    setSavingId(user.id);
    try {
      const result = await api.admin.restoreUser(user.id);
      setUsers((prev) => prev.map((item) => (
        item.id === user.id
          ? { ...item, isActive: true, accountStatus: result.data?.accountStatus ?? "active" }
          : item
      )));
      alert("已找回该账号");
    } finally {
      setSavingId(null);
    }
  };

  const getStatus = (user: UserType) => user.accountStatus ?? (user.isActive === false ? "banned" : "active");

  const counts = users.reduce(
    (acc, user) => {
      acc[getStatus(user)] += 1;
      return acc;
    },
    { active: 0, banned: 0, cancelled: 0 },
  );

  const filtered = users.filter((u) => {
    const matchesText = u.username.includes(search) || u.email.includes(search);
    const matchesStatus = statusFilter === "all" || getStatus(u) === statusFilter;
    return matchesText && matchesStatus;
  });

  const roleLabel = (role: string) => {
    if (role === "student") return { label: "学员", color: "bg-green-50 text-green-600" };
    if (role === "teacher") return { label: "教师", color: "bg-indigo-50 text-indigo-600" };
    return { label: "管理员", color: "bg-orange-50 text-orange-600" };
  };

  const statusLabel = (user: UserType) => {
    const status = getStatus(user);
    if (status === "cancelled") return { label: "已注销", color: "bg-red-50 text-red-600" };
    if (status === "banned") return { label: "已封禁", color: "bg-gray-100 text-gray-500" };
    return { label: "正常", color: "bg-green-50 text-green-600" };
  };

  const filters: { key: typeof statusFilter; label: string; count: number }[] = [
    { key: "all", label: "全部", count: users.length },
    { key: "active", label: "正常", count: counts.active },
    { key: "banned", label: "已封禁", count: counts.banned },
    { key: "cancelled", label: "已注销", count: counts.cancelled },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">用户管理</h2>
          <p className="text-sm text-gray-500 mt-1">管理系统中的所有用户账号</p>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">共 {users.length} 个用户</span>
      </div>

      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索用户名或邮箱..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setStatusFilter(filter.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === filter.key
                  ? "bg-indigo-500 text-white"
                  : "bg-white border border-gray-100 text-gray-500 hover:border-indigo-200 hover:text-indigo-600"
              }`}
            >
              {filter.label} {filter.count}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">用户名</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">邮箱</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">角色</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">状态</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const rl = roleLabel(u.role);
                const sl = statusLabel(u);
                const isCancelled = u.accountStatus === "cancelled";
                const isActive = u.accountStatus ? u.accountStatus === "active" : u.isActive !== false;
                const isSelf = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"><User className="w-3.5 h-3.5 text-gray-500" /></div>
                        <span className="font-medium text-gray-800">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3"><span className={"text-xs font-medium px-2 py-0.5 rounded-full " + rl.color}>{rl.label}</span></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sl.color}`}>
                        {sl.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isCancelled ? (
                          <button
                            onClick={() => void handleRestore(u)}
                            disabled={savingId === u.id}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all text-green-600 bg-green-50 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <RotateCcw className="w-3 h-3 inline mr-1" />
                            找回
                          </button>
                        ) : (
                          <button
                            onClick={() => void handleToggleStatus(u)}
                            disabled={savingId === u.id || (isSelf && isActive)}
                            title={isSelf && isActive ? "管理员不能封禁自己" : undefined}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                              isActive
                                ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                                : "text-green-600 bg-green-50 hover:bg-green-100"
                            }`}
                          >
                            {isActive ? <Ban className="w-3 h-3 inline mr-1" /> : <RotateCcw className="w-3 h-3 inline mr-1" />}
                            {isActive ? "封禁" : "解封"}
                          </button>
                        )}
                        <button
                          onClick={() => void handleDelete(u.id)}
                          disabled={isSelf || isCancelled}
                          title={isCancelled ? "该用户已注销" : isSelf ? "不能删除当前登录账号" : undefined}
                          className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-3 h-3 inline mr-1" />删除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}




