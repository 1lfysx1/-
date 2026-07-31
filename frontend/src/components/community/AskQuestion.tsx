import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { api } from "../../mock/api";

interface AskQuestionProps {
  onClose: () => void;
}

export default function AskQuestion({ onClose }: AskQuestionProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    try {
      await api.community.create({
        title: title.trim(),
        description: description.trim(),
        tags: tags.split(/[,，\s]+/).filter(Boolean),
      });
      setSubmitted(true);
      setTimeout(onClose, 1500);
    } catch {} finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full animate-fade-in-up">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="text-green-500 text-2xl">鉁</div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">发布成功</h3>
          <p className="text-sm text-gray-500">你的问题已发布，等待同学回答</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">发布问题</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">标题</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="用简短的语言概括你的问题"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">详细描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="详细描述你的问题，包括你尝试过的解决方法..."
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">标签</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="用逗号分隔，例如：Python, 基础"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim() || loading}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white font-medium rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            发布问题
          </button>
        </div>
      </div>
    </div>
  );
}


