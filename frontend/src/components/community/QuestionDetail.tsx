import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { CheckCircle2, Loader2, MessageSquare, Sparkles, Star, ThumbsUp, Trash2 } from "lucide-react";
import { api, type CommunityAnswer, type CommunityDetail } from "../../mock/api";
import { formatDate } from "../../utils/helpers";

interface QuestionDetailProps {
  questionId: string;
}

interface AnswerCardProps {
  answer: CommunityAnswer;
  liking: boolean;
  deleting: boolean;
  onLike: (event: MouseEvent<HTMLButtonElement>, answerId: string) => void;
  onDelete: (answerId: string) => void;
}

function AnswerCard({ answer, liking, deleting, onLike, onDelete }: AnswerCardProps) {
  return (
    <article className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-900 truncate">{answer.authorName || "匿名用户"}</span>
            {answer.isGood && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                <Star className="w-3 h-3" /> 优质回答
              </span>
            )}
            {answer.isAdopted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                <CheckCircle2 className="w-3 h-3" /> 已采纳
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">{formatDate(answer.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={(event) => onLike(event, answer.id)}
            disabled={liking}
            className={`inline-flex items-center gap-1 text-xs transition-colors disabled:opacity-60 ${answer.hasLiked ? "text-orange-500" : "text-gray-400 hover:text-orange-500"}`}
            title={answer.hasLiked ? "取消点赞" : "点赞"}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${answer.hasLiked ? "fill-current" : ""}`} /> {answer.likeCount}
          </button>
          {answer.canDelete && (
            <button
              type="button"
              onClick={() => onDelete(answer.id)}
              disabled={deleting}
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
              title="删除这条回复"
            >
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{answer.content}</p>
    </article>
  );
}

export default function QuestionDetail({ questionId }: QuestionDetailProps) {
  const [detail, setDetail] = useState<CommunityDetail | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likingAnswerIds, setLikingAnswerIds] = useState<Set<string>>(new Set());
  const [deletingAnswerIds, setDeletingAnswerIds] = useState<Set<string>>(new Set());

  const loadDetail = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.community.getDetail(questionId);
      setDetail(data);
    } catch {
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const handleSubmitAnswer = async () => {
    const content = answerText.trim();
    if (!content || submitting) return;
    setSubmitting(true);
    try {
      await api.community.createAnswer({ questionId, content });
      setAnswerText("");
      const data = await api.community.getDetail(questionId);
      setDetail(data);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeAnswer = async (event: MouseEvent<HTMLButtonElement>, answerId: string) => {
    event.stopPropagation();
    if (likingAnswerIds.has(answerId)) return;
    setLikingAnswerIds((previous) => new Set(previous).add(answerId));
    try {
      const result = await api.community.likeAnswer(answerId);
      setDetail((current) => current ? {
        ...current,
        answers: current.answers.map((answer) => (
          answer.id === answerId
            ? { ...answer, likeCount: result.likeCount, hasLiked: result.liked }
            : answer
        )),
      } : current);
    } catch {
      await loadDetail();
    } finally {
      setLikingAnswerIds((previous) => {
        const next = new Set(previous);
        next.delete(answerId);
        return next;
      });
    }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (deletingAnswerIds.has(answerId)) return;
    if (!window.confirm("确定删除这条回复吗？删除后不可恢复。")) return;
    setDeletingAnswerIds((previous) => new Set(previous).add(answerId));
    try {
      const result = await api.community.deleteAnswer(answerId);
      setDetail((current) => current ? {
        ...current,
        question: { ...current.question, answerCount: result.answerCount },
        answers: current.answers.filter((answer) => answer.id !== answerId),
      } : current);
    } catch {
      await loadDetail();
    } finally {
      setDeletingAnswerIds((previous) => {
        const next = new Set(previous);
        next.delete(answerId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    );
  }

  if (!detail) {
    return <div className="py-16 text-center text-sm text-gray-400">问题不存在或加载失败</div>;
  }

  const { question, answers } = detail;
  const goodAnswers = answers.filter((answer) => answer.isGood);
  const otherAnswers = answers.filter((answer) => !answer.isGood);
  const visibleAnswers = goodAnswers.length > 0 ? otherAnswers : answers;

  const renderAnswer = (answer: CommunityAnswer) => (
    <AnswerCard
      key={answer.id}
      answer={answer}
      liking={likingAnswerIds.has(answer.id)}
      deleting={deletingAnswerIds.has(answer.id)}
      onLike={handleLikeAnswer}
      onDelete={handleDeleteAnswer}
    />
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-gray-900 break-words">{question.title}</h1>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap mt-3">{question.description}</p>
          </div>
          <span className="text-xs text-gray-400 shrink-0">{formatDate(question.createdAt)}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
          {question.tags.map((tag) => (
            <span key={tag} className="text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
          <span className="inline-flex items-center gap-1 ml-auto">
            <MessageSquare className="w-3 h-3" /> 回答 {answers.length}
          </span>
        </div>
      </section>

      {detail.aggregateAnswer ? (
        <section className="rounded-xl border border-amber-100 bg-amber-50/70 p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800">
              <Sparkles className="h-4 w-4" />
              智能体综合整理
            </h2>
            <span className="text-[10px] text-amber-600">
              {detail.aggregateAnswer.source === "llm" ? "大模型生成" : "本地规则整理"}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-7 text-amber-950">{detail.aggregateAnswer.content}</p>
        </section>
      ) : detail.aggregateStatus === "generating" ? (
        <section className="rounded-xl border border-amber-100 bg-amber-50/70 p-5 text-sm text-amber-700">
          <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
          智能体正在整理大家的回答…
        </section>
      ) : null}

      {goodAnswers.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500" /> 优质回答
          </h2>
          <div className="space-y-3">
            {goodAnswers.map(renderAnswer)}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          {goodAnswers.length > 0 ? `其他回答 (${visibleAnswers.length})` : `全部回答 (${answers.length})`}
        </h2>
        {answers.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center text-sm text-gray-400">
            暂无回答，来分享你的经验吧
          </div>
        ) : visibleAnswers.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center text-sm text-gray-400">
            暂无其他回答
          </div>
        ) : (
          <div className="space-y-3">
            {visibleAnswers.map(renderAnswer)}
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">你的回答</h2>
        <textarea
          value={answerText}
          onChange={(event) => setAnswerText(event.target.value)}
          rows={4}
          placeholder="写下你的回答..."
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all mb-3"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => void handleSubmitAnswer()}
            disabled={!answerText.trim() || submitting}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white text-sm font-medium rounded-xl transition-all disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {submitting ? "提交中..." : "提交回答"}
          </button>
          <span className="text-xs text-gray-400">请友善交流，共同进步</span>
        </div>
      </section>
    </div>
  );
}
