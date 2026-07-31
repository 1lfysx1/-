import { useEffect, useState } from "react";
import { BookOpen, FileQuestion, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { api, type Course, type Position } from "../../mock/api";

export default function PositionsPanel() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [creatingCourseId, setCreatingCourseId] = useState<string | null>(null);
  const [coursesByPosition, setCoursesByPosition] = useState<Record<string, Course[]>>({});
  const [uploadMessage, setUploadMessage] = useState<Record<string, string>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const positionList = await api.positions.list();
      setPositions(positionList);
      const courseEntries = await Promise.all(
        positionList.map(async (position) => [position.id, await api.courses.list(position.id)] as const),
      );
      setCoursesByPosition(Object.fromEntries(courseEntries));
    } catch {
      setPositions([]);
      setCoursesByPosition({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSubmitting(true);
    try {
      await api.admin.addPosition({
        name: newName.trim(),
        description: newDesc.trim(),
        icon: newIcon.trim() || "📚",
      });
      setShowAdd(false);
      setNewName("");
      setNewDesc("");
      setNewIcon("");
      await loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateDefaultCourse = async (position: Position) => {
    setCreatingCourseId(position.id);
    try {
      const course = await api.admin.createDefaultCourse(position.id);
      setCoursesByPosition((previous) => ({ ...previous, [position.id]: [course] }));
      setPositions((previous) =>
        previous.map((item) => item.id === position.id ? { ...item, courseCount: Math.max(1, item.courseCount) } : item),
      );
      setUploadMessage((previous) => ({ ...previous, [course.id]: "默认课程已生成，现在可以上传知识库PDF和题库PDF" }));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "默认课程生成失败");
    } finally {
      setCreatingCourseId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("确认删除该岗位吗？此操作不可恢复。")) return;
    await api.admin.deletePosition(id);
    setPositions((previous) => previous.filter((position) => position.id !== id));
  };

  const handleUpload = async (course: Course, file: File | null, kind: "knowledge" | "questions") => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      window.alert("请上传 PDF 文件");
      return;
    }
    const uploadKey = `${kind}:${course.id}`;
    setUploadingId(uploadKey);
    setUploadMessage((previous) => ({ ...previous, [course.id]: "" }));
    try {
      if (kind === "knowledge") {
        const result = await api.admin.uploadKnowledgeBase(course.id, file);
        const data = result.data;
        setUploadMessage((previous) => ({
          ...previous,
          [course.id]: `知识库导入成功：${data.pages} 页，${data.chunks} 个内容块，新增 ${data.knowledgePoints} 个知识点`,
        }));
      } else {
        const result = await api.admin.uploadQuestionBank(course.id, file);
        const data = result.data;
        setUploadMessage((previous) => ({
          ...previous,
          [course.id]: `题库导入成功：解析 ${data.questions} 题，新增 ${data.imported} 题，更新 ${data.updated} 题`,
        }));
      }
      await loadData();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "上传失败");
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">岗位与知识库管理</h2>
          <p className="text-sm text-gray-500 mt-1">管理培训岗位及其对应的知识库文件。</p>
        </div>
        <button onClick={() => setShowAdd((visible) => !visible)} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-all">
          <Plus className="w-4 h-4" />新增岗位
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">添加新岗位</h3>
          <div className="space-y-3">
            <input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="岗位名称（例如：人工智能工程师）" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" />
            <textarea value={newDesc} onChange={(event) => setNewDesc(event.target.value)} rows={2} placeholder="岗位描述" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 resize-none" />
            <input value={newIcon} onChange={(event) => setNewIcon(event.target.value)} placeholder="图标 emoji（如：🤖）" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" />
            <div className="flex gap-2">
              <button onClick={() => void handleAdd()} disabled={submitting || !newName.trim()} className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-200 text-white text-sm font-medium rounded-xl transition-all">
                {submitting ? "添加中..." : "确认添加"}
              </button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">取消</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 animate-stagger">
        {positions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-sm text-gray-500">暂无岗位数据</div>
        ) : positions.map((position) => {
          const courses = coursesByPosition[position.id] || [];
          return (
            <div key={position.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{position.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">{position.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{position.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{position.studentCount} 名学员 · {position.courseCount} 门课程</p>
                </div>
                <button onClick={() => void handleDelete(position.id)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all">
                  <Trash2 className="w-3 h-3" />删除
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {courses.length === 0 ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-3">
                    <span className="text-xs text-gray-400">该岗位暂无课程，需先生成默认课程后上传知识库和题库</span>
                    <button
                      type="button"
                      onClick={() => void handleCreateDefaultCourse(position)}
                      disabled={creatingCourseId === position.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {creatingCourseId === position.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                      生成默认课程
                    </button>
                  </div>
                ) : courses.map((course) => {
                  const knowledgeKey = `knowledge:${course.id}`;
                  const questionsKey = `questions:${course.id}`;
                  return (
                    <div key={course.id} className="rounded-lg bg-gray-50 px-3 py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex-1 min-w-48">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                            <BookOpen className="w-4 h-4 text-indigo-400" />
                            {course.name}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {course.knowledgePointCount} 个知识点 · {course.materialCount} 个资料
                          </p>
                        </div>
                        <label className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-100 rounded-lg transition-all">
                          {uploadingId === knowledgeKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                          知识库PDF
                          <input
                            type="file"
                            accept="application/pdf,.pdf"
                            disabled={uploadingId !== null}
                            onChange={(event) => void handleUpload(course, event.target.files?.[0] || null, "knowledge")}
                            className="hidden"
                          />
                        </label>
                        <label className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-600 bg-white hover:bg-emerald-50 border border-emerald-100 rounded-lg transition-all">
                          {uploadingId === questionsKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileQuestion className="w-3 h-3" />}
                          题库PDF
                          <input
                            type="file"
                            accept="application/pdf,.pdf"
                            disabled={uploadingId !== null}
                            onChange={(event) => void handleUpload(course, event.target.files?.[0] || null, "questions")}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {uploadMessage[course.id] && (
                        <p className="mt-2 text-xs text-green-600">{uploadMessage[course.id]}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
