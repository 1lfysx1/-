import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { ArrowLeft, CheckCircle2, Loader2, MessageSquare, Plus, Search, Sparkles, ThumbsUp } from "lucide-react";
import { api, type CommunityQuestion } from "../../mock/api";
import { formatDate } from "../../utils/helpers";
import AskQuestion from "./AskQuestion";
import QuestionDetail from "./QuestionDetail";

export default function CommunityView() {
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAsk, setShowAsk] = useState(false);
  const [likingIds, setLikingIds] = useState<Set<string>>(new Set());

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.community.list();
      setQuestions(data);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleBackToList = () => {
    setSelectedId(null);
    void loadData();
  };

  const handleLike = async (event: MouseEvent<HTMLButtonElement>, questionId: string) => {
    event.stopPropagation();
    if (likingIds.has(questionId)) return;
    setLikingIds((previous) => new Set(previous).add(questionId));
    try {
      const result = await api.community.likeQuestion(questionId);
      setQuestions((previous) => previous.map((question) => (
        question.id === questionId
          ? { ...question, likeCount: result.likeCount, hasLiked: result.liked }
          : question
      )));
    } catch {
      await loadData();
    } finally {
      setLikingIds((previous) => {
        const next = new Set(previous);
        next.delete(questionId);
        return next;
      });
    }
  };

  const filtered = questions.filter((question) => {
    const keyword = search.trim();
    if (!keyword) return true;
    return question.title.includes(keyword) || question.description.includes(keyword) || question.tags.some((tag) => tag.includes(keyword));
  });

  if (selectedId) {
    return (
      <div>
        <button
          onClick={handleBackToList}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> 返回列表
        </button>
        <QuestionDetail questionId={selectedId} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">社区问答</h2>
          <p className="text-sm text-gray-500 mt-1">与同学交流问题，共同进步</p>
        </div>
        <button
          onClick={() => setShowAsk(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          发布问题
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="搜索问题或标签..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">暂无相关问题</p>
        </div>
      ) : (
        <div className="space-y-3 animate-stagger">
          {filtered.map((question) => (
            <article
              key={question.id}
              onClick={() => setSelectedId(question.id)}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">{question.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{question.description}</p>
                </div>
                {question.hasGoodAnswer && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-400" title="回答数">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {question.answerCount}
                </div>
                <button
                  type="button"
                  onClick={(event) => void handleLike(event, question.id)}
                  disabled={likingIds.has(question.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors disabled:opacity-60 ${question.hasLiked ? "text-orange-500" : "text-gray-400 hover:text-orange-500"}`}
                  title={question.hasLiked ? "取消点赞" : "点赞"}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${question.hasLiked ? "fill-current" : ""}`} />
                  {question.likeCount}
                </button>
                <div className="flex gap-1.5 flex-1">
                  {question.hasAggregateAnswer && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      已整理
                    </span>
                  )}
                  {question.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{formatDate(question.createdAt)}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {showAsk && <AskQuestion onClose={() => { setShowAsk(false); void loadData(); }} />}
    </div>
  );
}
