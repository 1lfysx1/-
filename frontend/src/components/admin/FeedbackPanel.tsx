import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { api, type Feedback } from "../../mock/api";
import { formatDate } from "../../utils/helpers";

export default function FeedbackPanel() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "resolved">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [resolving, setResolving] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try { setFeedbacks(await api.admin.getFeedbacks()); } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleResolve = async (id: string) => {
    const reply = replyText[id] || "";
    setResolving(id);
    try {
      await api.admin.resolveFeedback(id, reply);
      setFeedbacks((prev) => prev.map((f) => f.id === id ? { ...f, status: "resolved", adminReply: reply, resolvedAt: new Date().toISOString() } : f));
      setExpandedId(null);
    } catch {} finally { setResolving(null); }
  };

  const counts = feedbacks.reduce(
    (acc, feedback) => {
      acc[feedback.status] += 1;
      return acc;
    },
    { pending: 0, resolved: 0 },
  );

  const filters: { key: typeof statusFilter; label: string; count: number }[] = [
    { key: "all", label: "全部", count: feedbacks.length },
    { key: "pending", label: "待处理", count: counts.pending },
    { key: "resolved", label: "已处理", count: counts.resolved },
  ];

  const filtered = feedbacks.filter((f) => {
    const matchesText = f.title.includes(search) || f.authorName.includes(search);
    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    return matchesText && matchesStatus;
  });

  const catLabel = (c: string) => ({ bug: "问题", feature: "建议", content: "内容", other: "其他" })[c] || c;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-semibold text-gray-900">反馈管理</h2><p className="text-sm text-gray-500 mt-1">查看和处理用户的反馈意见</p></div>
        <div className="flex gap-2 text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
          <span>共 {feedbacks.length} 条</span>
          <span>待处理 {feedbacks.filter((f) => f.status === "pending").length} 条</span>
        </div>
      </div>
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索反馈标题或提交人..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" />
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
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-sm text-gray-500">暂无反馈</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((fb) => {
            const isExpanded = expandedId === fb.id;
            return (
              <div key={fb.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all">
                <button onClick={() => setExpandedId(isExpanded ? null : fb.id)} className="w-full flex items-center gap-4 p-4 text-left">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${fb.status === "pending" ? "bg-amber-400" : "bg-green-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-medium text-gray-900">{fb.title}</h3>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${fb.status === "resolved" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>{fb.status === "resolved" ? "已处理" : "待处理"}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{catLabel(fb.category)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{fb.authorName}</span><span>{formatDate(fb.createdAt)}</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-3 animate-fade-in space-y-3">
                    <p className="text-sm text-gray-700 leading-relaxed">{fb.description}</p>
                    {fb.adminReply && <div className="bg-indigo-50 rounded-xl p-3"><p className="text-xs font-medium text-indigo-600 mb-1">已回复</p><p className="text-sm text-gray-700">{fb.adminReply}</p></div>}
                    {fb.status === "pending" && (
                      <div className="space-y-2">
                        <textarea value={replyText[fb.id] || ""} onChange={(e) => setReplyText((prev) => ({ ...prev, [fb.id]: e.target.value }))} rows={2} placeholder="输入回复内容（可选）..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" />
                        <button onClick={() => handleResolve(fb.id)} disabled={resolving === fb.id} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-200 text-white text-xs font-medium rounded-lg transition-all">
                          {resolving === fb.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                          标记为已处理
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}




