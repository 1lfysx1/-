import { useEffect, useState } from "react";
import { AlertTriangle, BookOpen, FileQuestion, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { api, type Course, type Position } from "../../mock/api";

const DEFAULT_ICON = "📚";

export default function PositionsPanel() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPosition, setShowAddPosition] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [coursesByPosition, setCoursesByPosition] = useState<Record<string, Course[]>>({});
  const [uploadMessage, setUploadMessage] = useState<Record<string, string>>({});
  const [addingCourseFor, setAddingCourseFor] = useState<string | null>(null);
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseSubmitting, setCourseSubmitting] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

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

  const resetPositionForm = () => {
    setNewName("");
    setNewDesc("");
    setNewIcon("");
  };

  const handleAddPosition = async () => {
    if (!newName.trim()) return;
    setSubmitting(true);
    try {
      await api.admin.addPosition({
        name: newName.trim(),
        description: newDesc.trim(),
        icon: newIcon.trim() || DEFAULT_ICON,
      });
      setShowAddPosition(false);
      resetPositionForm();
      await loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const openCourseForm = (positionId: string) => {
    setAddingCourseFor(positionId);
    setCourseName("");
    setCourseDesc("");
  };

  const handleAddCourse = async (positionId: string) => {
    if (!courseName.trim()) return;
    setCourseSubmitting(true);
    try {
      await api.admin.addCourse(positionId, { name: courseName.trim(), description: courseDesc.trim() });
      setAddingCourseFor(null);
      setCourseName("");
      setCourseDesc("");
      await loadData();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "课程新增失败");
    } finally {
      setCourseSubmitting(false);
    }
  };

  const handleDeletePosition = async (position: Position) => {
    if (!window.confirm(`确认删除岗位“${position.name}”吗？该岗位下课程也会一起删除。`)) return;
    await api.admin.deletePosition(position.id);
    setPositions((previous) => previous.filter((item) => item.id !== position.id));
    setCoursesByPosition((previous) => {
      const next = { ...previous };
      delete next[position.id];
      return next;
    });
  };

  const buildCourseRiskText = (course: Course) => {
    const knowledgeCount = course.knowledgePointCount || 0;
    const materialCount = course.materialCount || 0;
    const questionCount = course.questionCount || 0;
    if (knowledgeCount + materialCount + questionCount === 0) {
      return `确认删除课程“${course.name}”吗？`;
    }
    return [
      `课程“${course.name}”已有数据，删除有风险。`,
      `资料：${materialCount} 个，知识点：${knowledgeCount} 个，题目：${questionCount} 题。`,
      "确认删除后，会同时删除该课程的资料记录、知识点、题目和知识库切片，已产生的答题记录会与题目解绑。",
      "是否确认继续删除？",
    ].join("\n");
  };

  const handleDeleteCourse = async (course: Course) => {
    if (!window.confirm(buildCourseRiskText(course))) return;
    setDeletingCourseId(course.id);
    try {
      await api.admin.deleteCourse(course.id);
      await loadData();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "课程删除失败");
    } finally {
      setDeletingCourseId(null);
    }
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
          <p className="text-sm text-gray-500 mt-1">先建立岗位，再在岗位下新增 Python、C、Java 等细分课程，并分别上传知识库和题库。</p>
        </div>
        <button onClick={() => setShowAddPosition((visible) => !visible)} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-all">
          <Plus className="w-4 h-4" />新增岗位
        </button>
      </div>

      {showAddPosition && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">添加新岗位</h3>
          <div className="space-y-3">
            <input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="岗位名称，例如：程序员、硬件工程师" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" />
            <textarea value={newDesc} onChange={(event) => setNewDesc(event.target.value)} rows={2} placeholder="岗位描述" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 resize-none" />
            <input value={newIcon} onChange={(event) => setNewIcon(event.target.value)} placeholder="图标 emoji，例如：💻" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" />
            <div className="flex gap-2">
              <button onClick={() => void handleAddPosition()} disabled={submitting || !newName.trim()} className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-200 text-white text-sm font-medium rounded-xl transition-all">
                {submitting ? "添加中..." : "确认添加"}
              </button>
              <button onClick={() => { setShowAddPosition(false); resetPositionForm(); }} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">取消</button>
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
                  <p className="text-xs text-gray-400 mt-1">{position.studentCount} 名学员 · {courses.length} 门课程</p>
                </div>
                <button onClick={() => openCourseForm(position.id)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all">
                  <Plus className="w-3 h-3" />新增课程
                </button>
                <button onClick={() => void handleDeletePosition(position)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all">
                  <Trash2 className="w-3 h-3" />删除岗位
                </button>
              </div>

              {addingCourseFor === position.id && (
                <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-indigo-900">为“{position.name}”新增课程</p>
                    <button onClick={() => setAddingCourseFor(null)} className="text-indigo-400 hover:text-indigo-600"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
                    <input value={courseName} onChange={(event) => setCourseName(event.target.value)} placeholder="课程名称，例如：Python" className="px-3 py-2 bg-white border border-indigo-100 rounded-lg text-sm outline-none focus:border-indigo-300" />
                    <input value={courseDesc} onChange={(event) => setCourseDesc(event.target.value)} placeholder="课程描述，例如：Python 基础语法、环境配置与题库练习" className="px-3 py-2 bg-white border border-indigo-100 rounded-lg text-sm outline-none focus:border-indigo-300" />
                    <button onClick={() => void handleAddCourse(position.id)} disabled={courseSubmitting || !courseName.trim()} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-200 text-white text-sm font-medium rounded-lg transition-all">
                      {courseSubmitting ? "保存中..." : "保存课程"}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2">
                {courses.length === 0 ? (
                  <div className="rounded-lg bg-gray-50 px-3 py-4 text-sm text-gray-500">该岗位暂无课程。请先新增 Python、C、Java 等细分课程，再上传对应知识库和题库。</div>
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
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{course.description || "暂无课程描述"}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {course.knowledgePointCount} 个知识点 · {course.materialCount} 个资料 · {course.questionCount || 0} 题
                          </p>
                        </div>
                        <label className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-100 rounded-lg transition-all">
                          {uploadingId === knowledgeKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                          知识库PDF
                          <input type="file" accept="application/pdf,.pdf" disabled={uploadingId !== null} onChange={(event) => void handleUpload(course, event.target.files?.[0] || null, "knowledge")} className="hidden" />
                        </label>
                        <label className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-600 bg-white hover:bg-emerald-50 border border-emerald-100 rounded-lg transition-all">
                          {uploadingId === questionsKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileQuestion className="w-3 h-3" />}
                          题库PDF
                          <input type="file" accept="application/pdf,.pdf" disabled={uploadingId !== null} onChange={(event) => void handleUpload(course, event.target.files?.[0] || null, "questions")} className="hidden" />
                        </label>
                        <button onClick={() => void handleDeleteCourse(course)} disabled={deletingCourseId === course.id} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-500 bg-white hover:bg-red-50 border border-red-100 rounded-lg transition-all disabled:cursor-not-allowed disabled:opacity-60">
                          {deletingCourseId === course.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <AlertTriangle className="w-3 h-3" />}
                          删除课程
                        </button>
                      </div>
                      {uploadMessage[course.id] && <p className="mt-2 text-xs text-green-600">{uploadMessage[course.id]}</p>}
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
