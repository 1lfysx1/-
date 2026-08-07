import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Database,
  Eye,
  FileQuestion,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { api, type Course, type CourseChunk, type CourseRagStatus, type Position } from "../../mock/api";

const DEFAULT_ICON = "📚";

function statusClass(status?: CourseRagStatus["status"]) {
  if (status === "indexed") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (status === "partial") return "bg-amber-50 text-amber-700 border-amber-100";
  if (status === "parsed") return "bg-sky-50 text-sky-700 border-sky-100";
  return "bg-gray-50 text-gray-600 border-gray-100";
}

function embeddingPercent(status?: CourseRagStatus) {
  if (!status || status.chunkCount <= 0) return 0;
  return Math.round((status.embeddingSuccess / status.chunkCount) * 100);
}

export default function PositionsPanel() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [coursesByPosition, setCoursesByPosition] = useState<Record<string, Course[]>>({});
  const [ragStatusByCourse, setRagStatusByCourse] = useState<Record<string, CourseRagStatus>>({});
  const [loading, setLoading] = useState(true);
  const [showAddPosition, setShowAddPosition] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<Record<string, string>>({});
  const [addingCourseFor, setAddingCourseFor] = useState<string | null>(null);
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseSubmitting, setCourseSubmitting] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [reindexingCourseId, setReindexingCourseId] = useState<string | null>(null);
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [previewChunks, setPreviewChunks] = useState<CourseChunk[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const positionList = await api.positions.list();
      const courseEntries = await Promise.all(
        positionList.map(async (position) => [position.id, await api.courses.list(position.id)] as const),
      );
      const allCourses = courseEntries.flatMap(([, courses]) => courses);
      const statusEntries = await Promise.all(
        allCourses.map(async (course) => {
          try {
            return [course.id, await api.admin.getCourseRagStatus(course.id)] as const;
          } catch {
            return null;
          }
        }),
      );
      const statusMap: Record<string, CourseRagStatus> = {};
      statusEntries.forEach((entry) => {
        if (entry) statusMap[entry[0]] = entry[1];
      });
      setPositions(positionList);
      setCoursesByPosition(Object.fromEntries(courseEntries));
      setRagStatusByCourse(statusMap);
    } catch {
      setPositions([]);
      setCoursesByPosition({});
      setRagStatusByCourse({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

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
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "岗位新增失败");
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
    try {
      await api.admin.deletePosition(position.id);
      await loadData();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "岗位删除失败");
    }
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
      "确认删除后，会同时删除课程资料、知识点、题目和知识库切片，已有答题记录会与题目解绑。",
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
          [course.id]: `知识库导入成功：${data.pages} 页，${data.chunks} 个切片，已向量化 ${data.embeddingSuccess} 个。`,
        }));
      } else {
        const result = await api.admin.uploadQuestionBank(course.id, file);
        const data = result.data;
        setUploadMessage((previous) => ({
          ...previous,
          [course.id]: `题库导入成功：解析 ${data.questions} 题，新增 ${data.imported} 题，更新 ${data.updated} 题。`,
        }));
      }
      await loadData();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "上传失败");
    } finally {
      setUploadingId(null);
    }
  };

  const handleReindex = async (course: Course) => {
    setReindexingCourseId(course.id);
    try {
      const result = await api.admin.reindexCourse(course.id);
      const status = await api.admin.getCourseRagStatus(course.id);
      setRagStatusByCourse((previous) => ({ ...previous, [course.id]: status }));
      setUploadMessage((previous) => ({
        ...previous,
        [course.id]: `索引重建完成：共处理 ${result.chunks} 个切片，已向量化 ${result.embeddingSuccess} 个。`,
      }));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "索引重建失败");
    } finally {
      setReindexingCourseId(null);
    }
  };

  const openChunkPreview = async (course: Course) => {
    setPreviewCourse(course);
    setPreviewChunks([]);
    setPreviewError("");
    setPreviewLoading(true);
    try {
      setPreviewChunks(await api.admin.getCourseChunks(course.id));
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : "切片加载失败");
    } finally {
      setPreviewLoading(false);
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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">岗位与知识库管理</h2>
          <p className="text-sm text-gray-500 mt-1">
            上传知识库 PDF 后，系统会完成文本解析、切片、向量化并写入本地索引。
          </p>
        </div>
        <button
          onClick={() => setShowAddPosition((visible) => !visible)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          新增岗位
        </button>
      </div>

      {showAddPosition && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">添加新岗位</h3>
          <div className="space-y-3">
            <input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="岗位名称，例如：程序员、硬件工程师"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
            <textarea
              value={newDesc}
              onChange={(event) => setNewDesc(event.target.value)}
              rows={2}
              placeholder="岗位描述"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 resize-none"
            />
            <input
              value={newIcon}
              onChange={(event) => setNewIcon(event.target.value)}
              placeholder="图标 emoji，例如：💻"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
            <div className="flex gap-2">
              <button
                onClick={() => void handleAddPosition()}
                disabled={submitting || !newName.trim()}
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-200 text-white text-sm font-medium rounded-xl transition-all"
              >
                {submitting ? "添加中..." : "确认添加"}
              </button>
              <button
                onClick={() => {
                  setShowAddPosition(false);
                  resetPositionForm();
                }}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                取消
              </button>
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
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-2xl">{position.icon}</span>
                <div className="flex-1 min-w-48">
                  <h3 className="text-sm font-semibold text-gray-900">{position.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{position.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{position.studentCount} 名学员 · {courses.length} 门课程</p>
                </div>
                <button
                  onClick={() => openCourseForm(position.id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
                >
                  <Plus className="w-3 h-3" />
                  新增课程
                </button>
                <button
                  onClick={() => void handleDeletePosition(position)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                  删除岗位
                </button>
              </div>

              {addingCourseFor === position.id && (
                <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-indigo-900">为“{position.name}”新增课程</p>
                    <button onClick={() => setAddingCourseFor(null)} className="text-indigo-400 hover:text-indigo-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
                    <input
                      value={courseName}
                      onChange={(event) => setCourseName(event.target.value)}
                      placeholder="课程名称，例如：Python"
                      className="px-3 py-2 bg-white border border-indigo-100 rounded-lg text-sm outline-none focus:border-indigo-300"
                    />
                    <input
                      value={courseDesc}
                      onChange={(event) => setCourseDesc(event.target.value)}
                      placeholder="课程描述，例如：Python 基础语法、环境配置与题库练习"
                      className="px-3 py-2 bg-white border border-indigo-100 rounded-lg text-sm outline-none focus:border-indigo-300"
                    />
                    <button
                      onClick={() => void handleAddCourse(position.id)}
                      disabled={courseSubmitting || !courseName.trim()}
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-200 text-white text-sm font-medium rounded-lg transition-all"
                    >
                      {courseSubmitting ? "保存中..." : "保存课程"}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2">
                {courses.length === 0 ? (
                  <div className="rounded-lg bg-gray-50 px-3 py-4 text-sm text-gray-500">
                    该岗位暂无课程。请先新增细分课程，再上传对应知识库和题库。
                  </div>
                ) : courses.map((course) => {
                  const knowledgeKey = `knowledge:${course.id}`;
                  const questionsKey = `questions:${course.id}`;
                  const status = ragStatusByCourse[course.id];
                  const progress = embeddingPercent(status);
                  return (
                    <div key={course.id} className="rounded-lg bg-gray-50 px-3 py-3">
                      <div className="flex flex-wrap items-start gap-3">
                        <div className="flex-1 min-w-56">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                            <BookOpen className="w-4 h-4 text-indigo-400" />
                            {course.name}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{course.description || "暂无课程描述"}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {course.knowledgePointCount} 个知识点 · {course.materialCount} 个资料 · {course.questionCount || 0} 题
                          </p>
                        </div>

                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(status?.status)}`}>
                          <Database className="w-3.5 h-3.5" />
                          {status?.statusText || "未上传知识库"}
                        </span>

                        <label className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-100 rounded-lg transition-all">
                          {uploadingId === knowledgeKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                          知识库 PDF
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
                          题库 PDF
                          <input
                            type="file"
                            accept="application/pdf,.pdf"
                            disabled={uploadingId !== null}
                            onChange={(event) => void handleUpload(course, event.target.files?.[0] || null, "questions")}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={() => void openChunkPreview(course)}
                          disabled={!status?.chunkCount}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-sky-600 bg-white hover:bg-sky-50 border border-sky-100 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          查看切片
                        </button>
                        <button
                          onClick={() => void handleReindex(course)}
                          disabled={!status?.chunkCount || reindexingCourseId !== null}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-violet-600 bg-white hover:bg-violet-50 border border-violet-100 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {reindexingCourseId === course.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                          重新生成索引
                        </button>
                        <button
                          onClick={() => void handleDeleteCourse(course)}
                          disabled={deletingCourseId === course.id}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-500 bg-white hover:bg-red-50 border border-red-100 rounded-lg transition-all disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingCourseId === course.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                          删除课程
                        </button>
                      </div>

                      <div className="mt-3 grid gap-2 text-xs text-gray-500 sm:grid-cols-4">
                        <span className="inline-flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />资料 {status?.materialCount ?? course.materialCount} 份</span>
                        <span className="inline-flex items-center gap-1.5"><Search className="w-3.5 h-3.5" />切片 {status?.chunkCount ?? 0} 个</span>
                        <span>已向量化 {status?.embeddingSuccess ?? 0} 个</span>
                        <span>索引状态 {status?.statusText || "未加载"}</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-white overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-400 transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      {uploadMessage[course.id] && <p className="mt-2 text-xs text-emerald-600">{uploadMessage[course.id]}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {previewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6" onClick={() => setPreviewCourse(null)}>
          <div
            className="w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="知识切片预览"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">{previewCourse.name} · 知识切片预览</h3>
                <p className="mt-1 text-xs text-gray-500">展示当前课程最多 200 个切片及其向量化状态。</p>
              </div>
              <button onClick={() => setPreviewCourse(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[calc(85vh-84px)] overflow-y-auto p-5">
              {previewLoading ? (
                <div className="flex items-center justify-center py-16 text-sm text-gray-500">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-indigo-400" />
                  正在加载切片...
                </div>
              ) : previewError ? (
                <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{previewError}</div>
              ) : previewChunks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
                  当前课程还没有可预览的知识切片。
                </div>
              ) : (
                <div className="space-y-3">
                  {previewChunks.map((chunk) => (
                    <div key={chunk.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-gray-800">#{chunk.chunkIndex + 1}</span>
                        <span className="text-gray-500">{chunk.filename}</span>
                        <span className="text-gray-400">第 {chunk.page} 页</span>
                        {chunk.chapter && <span className="text-gray-500">{chunk.chapter}</span>}
                        <span className={`rounded-full px-2 py-0.5 ${chunk.hasEmbedding ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {chunk.hasEmbedding ? "已向量化" : "待向量化"}
                        </span>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{chunk.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
