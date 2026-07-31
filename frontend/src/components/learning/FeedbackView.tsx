import { useState, useEffect } from "react";
import { Send, Loader2, MessageCircle, Clock, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { api, type Feedback } from "../../mock/api";
import { formatDate } from "../../utils/helpers";

const CATEGORIES = [
  { key: "bug", label: "问题反馈", desc: "遇到系统错误或功能异常" },
  { key: "feature", label: "功能建议", desc: "对新功能或改进的建议" },
  { key: "content", label: "内容反馈", desc: "课程内容错误或遗漏" },
  { key: "other", label: "其他", desc: "其他类型的反馈" },
];

export default function FeedbackView() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("bug");
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadFeedbacks = async () => {
    setLoading(true);
    try { setFeedbacks(await api.feedback.list()); } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadFeedbacks(); }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      await api.feedback.create({ title: title.trim(), description: description.trim(), category });
      setTitle(""); setDescription(""); setCategory("bug"); setShowForm(false);
      loadFeedbacks();
    } catch {} finally { setSubmitting(false); }
  };

  const statusIcon = (s: string) => s === "resolved" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-amber-500" />;
  const statusLabel = (status: string) => status === "resolved" ? "已处理" : "待处理";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">意见反馈</h2>
          <p className="text-sm text-gray-500 mt-1">向我们反馈问题或提出建议</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-all">
          <Send className="w-4 h-4" /> 提交反馈
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">提交新反馈</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">反馈类型</label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c.key} onClick={() => setCategory(c.key)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all ${category === c.key ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <p className="font-medium text-gray-800 mb-0.5">{c.label}</p>
                    <p className="text-gray-400">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="反馈标题（简要概括）" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="详细描述你的反馈内容..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
            <div className="flex gap-2">
              <button onClick={handleSubmit} disabled={submitting || !title.trim() || !description.trim()} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white text-sm font-medium rounded-xl transition-all">{submitting ? "提交中..." : "提交反馈"}</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">取消</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-orange-400" /></div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">暂无反馈记录</p>
          <p className="text-xs text-gray-400 mt-1">点击上方“提交反馈”按钮给我们留言</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((fb) => {
            const isExpanded = expandedId === fb.id;
            const cat = CATEGORIES.find((c) => c.key === fb.category);
            return (
              <div key={fb.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all">
                <button onClick={() => setExpandedId(isExpanded ? null : fb.id)} className="w-full flex items-center gap-3 p-4 text-left">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${fb.status === "resolved" ? "bg-green-50" : "bg-amber-50"}`}>
                    {statusIcon(fb.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-medium text-gray-900">{fb.title}</h3>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${fb.status === "resolved" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>{statusLabel(fb.status)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{cat?.label || fb.category}</span>
                      <span>{formatDate(fb.createdAt)}</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-3 animate-fade-in">
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{fb.description}</p>
                    {fb.adminReply && (
                      <div className="bg-indigo-50 rounded-xl p-3">
                        <p className="text-xs font-medium text-indigo-600 mb-1">管理员回复</p>
                        <p className="text-sm text-gray-700">{fb.adminReply}</p>
                      </div>
                    )}
                    {fb.status === "resolved" && fb.resolvedAt && (
                      <p className="text-xs text-gray-400 mt-2">处理时间：{formatDate(fb.resolvedAt)}</p>
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





