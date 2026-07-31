import { useEffect, useState } from "react";
import { Loader2, MessageSquare, Pin, Search, ThumbsUp, Trash2 } from "lucide-react";
import { api, type CommunityQuestion } from "../../mock/api";
import { formatDate } from "../../utils/helpers";

export default function CommunityPanel() {
  const [posts, setPosts] = useState<CommunityQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      setPosts(await api.admin.getPosts());
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("确认删除该帖子吗？此操作不可恢复。")) return;
    await api.admin.deletePost(id);
    setPosts((previous) => previous.filter((post) => post.id !== id));
  };

  const handlePin = async (id: string) => {
    await api.admin.pinPost(id);
    window.alert("已置顶该帖子");
  };

  const filtered = posts.filter((post) => post.title.includes(search) || post.authorName.includes(search));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">社区管理</h2>
          <p className="text-sm text-gray-500 mt-1">管理社区帖子和用户内容</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="搜索帖子标题或作者..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-sm text-gray-500">暂无帖子</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:border-gray-200 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                  {post.hasGoodAnswer && <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">已解决</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{post.authorName}</span>
                  <span>{formatDate(post.createdAt)}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{post.answerCount}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{post.likeCount}</span>
                </div>
                <div className="flex gap-1 mt-1">
                  {post.tags.map((tag) => <span key={tag} className="text-[10px] text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-full">{tag}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => void handlePin(post.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all">
                  <Pin className="w-3 h-3" />置顶
                </button>
                <button onClick={() => void handleDelete(post.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all">
                  <Trash2 className="w-3 h-3" />删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}