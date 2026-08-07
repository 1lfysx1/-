import type {
  Chapter,
  CommunityDetail,
  CommunityQuestion,
  Course,
  CourseChunk,
  CourseRagStatus,
  ExerciseResponse,
  ExerciseKnowledgePoint,
  PretestResponse,
  PretestStatus,
  Feedback,
  KpMastery,
  Position,
  PracticalResponse,
  QAResponse,
  Question,
  Recommendation,
  User,
  UserScore,
  WrongQuestion,
} from "../types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";
type JsonBody = Record<string, unknown> | unknown[] | string | number | boolean | null;

type ApiEnvelope<T> = { success: boolean; data: T };

function getToken(): string | null {
  return localStorage.getItem("token");
}

const ERROR_MESSAGES: Record<string, string> = {
  "Account disabled": "账号已被停用",
  "账号已注销": "账号已注销",
  "Authentication required": "请先登录",
  "Invalid token": "登录状态已失效，请重新登录",
  "User not found": "用户不存在",
  "Permission denied": "没有操作权限",
  "Wrong verification code": "验证码错误",
  "Username exists": "用户名已存在",
  "Email registered": "邮箱已注册",
  "邮箱未注册": "该邮箱未注册，请检查邮箱是否填写正确",
  "验证码发送失败，请稍后重试": "验证码发送失败，请稍后重试",
  "Question not found": "问题不存在",
  "Answer not found": "回答不存在",
  "Course not found": "课程不存在",
  "Material not found": "资料不存在",
  "Request failed": "请求失败，请稍后重试",
  "Upload failed": "上传失败，请稍后重试",
  "Failed to fetch": "无法连接服务器，请确认系统已启动",
};

function toChineseError(message: string | undefined, fallback: string): string {
  if (!message) return fallback;
  return ERROR_MESSAGES[message] ?? message;
}

async function request<T>(method: string, url: string, body?: JsonBody): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const options: RequestInit = { method, headers };
  if (body !== undefined) options.body = JSON.stringify(body);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${url}`, options);
  } catch (error) {
    throw new Error(toChineseError(error instanceof Error ? error.message : undefined, "无法连接服务器，请确认系统已启动"));
  }
  const text = await response.text();
  const data = text ? JSON.parse(text) as T : ({} as T);
  if (!response.ok) {
    const error = data as T & { detail?: string; message?: string };
    throw new Error(toChineseError(error.detail || error.message, "请求失败，请稍后重试"));
  }
  return data;
}

const get = <T>(url: string) => request<T>("GET", url);
const post = <T>(url: string, body?: JsonBody) => request<T>("POST", url, body);
const del = <T>(url: string) => request<T>("DELETE", url);
const put = <T>(url: string, body?: JsonBody) => request<T>("PUT", url, body);

async function uploadFile<T>(url: string, file: File, fields: Record<string, string>): Promise<T> {
  const form = new FormData();
  form.append("file", file);
  Object.entries(fields).forEach(([key, value]) => form.append(key, value));
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${url}`, { method: "POST", headers, body: form });
  } catch (error) {
    throw new Error(toChineseError(error instanceof Error ? error.message : undefined, "无法连接服务器，请确认系统已启动"));
  }
  const text = await response.text();
  const data = text ? JSON.parse(text) as T : ({} as T);
  if (!response.ok) {
    const error = data as T & { detail?: string; message?: string };
    throw new Error(toChineseError(error.detail || error.message, "上传失败，请稍后重试"));
  }
  return data;
}

export const api = {
  auth: {
    login: async (credentials: { username: string; password: string }): Promise<{ token: string; user: User }> => {
      const result = await post<{ token: string; user: User }>("/auth/login", credentials);
      localStorage.setItem("token", result.token);
      return result;
    },
    register: async (data: { username: string; email: string; password: string; code: string }): Promise<{ token: string; user: User }> => {
      const result = await post<{ token: string; user: User }>("/auth/register", data);
      localStorage.setItem("token", result.token);
      return result;
    },
    sendVerifyCode: (email: string): Promise<{ success: boolean }> => post("/auth/send-code", { email }),
    sendResetCode: (email: string): Promise<{ success: boolean }> => post("/auth/send-reset-code", { email }),
    resetPassword: (data: { email: string; password: string; code: string }): Promise<{ success: boolean; message: string }> =>
      post("/auth/reset-password", data),
    cancelAccount: (): Promise<{ success: boolean }> => del("/auth/account"),
    logout: () => localStorage.removeItem("token"),
  },

  positions: {
    list: async (): Promise<Position[]> => (await get<ApiEnvelope<Position[]>>("/positions")).data,
  },

  courses: {
    list: async (positionId: string): Promise<Course[]> =>
      (await get<ApiEnvelope<Course[]>>(`/courses?position_id=${encodeURIComponent(positionId)}`)).data,
    getDetail: async (courseId: string): Promise<Course> =>
      (await get<ApiEnvelope<Course>>(`/courses/${encodeURIComponent(courseId)}`)).data,
  },

  learning: {
    getChapters: async (courseId?: string, courseName?: string): Promise<Chapter[]> => {
      const params = new URLSearchParams();
      if (courseId) params.set("course_id", courseId);
      if (courseName) params.set("course_name", courseName);
      const query = params.toString() ? `?${params.toString()}` : "";
      return (await get<ApiEnvelope<Chapter[]>>(`/learning/chapters${query}`)).data;
    },
    getCourseRagStatus: async (courseId: string): Promise<CourseRagStatus> =>
      (await get<ApiEnvelope<CourseRagStatus>>(`/learning/courses/${encodeURIComponent(courseId)}/rag-status`)).data,
    generateExercise: async (kpIds: string[]): Promise<Question[]> => {
      const query = kpIds.length > 0 ? `?kp_ids=${encodeURIComponent(kpIds.join(","))}` : "";
      return (await get<ApiEnvelope<Question[]>>(`/exercise/questions${query}`)).data;
    },
  },

  qa: {
    ask: async (question: string, courseId?: string): Promise<QAResponse> =>
      post<QAResponse>("/qa/ask", { question, courseId }),
  },

  practical: {
    generate: (query: string, courseId?: string): Promise<PracticalResponse> =>
      post("/practical/generate", { query, courseId }),
  },

  exercise: {
    getKnowledgePoints: async (courseId?: string): Promise<ExerciseKnowledgePoint[]> => {
      const query = courseId ? `?course_id=${encodeURIComponent(courseId)}` : "";
      return (await get<ApiEnvelope<ExerciseKnowledgePoint[]>>(`/exercise/knowledge-points${query}`)).data;
    },
    getQuestions: async (kpIds?: string[]): Promise<Question[]> => {
      const query = kpIds && kpIds.length > 0 ? `?kp_ids=${encodeURIComponent(kpIds.join(","))}` : "";
      return (await get<ApiEnvelope<Question[]>>(`/exercise/questions${query}`)).data;
    },
    submit: (answers: { questionId: string; answer: string | string[] }[], courseId?: string): Promise<ExerciseResponse> =>
      post("/exercise/submit", { answers, courseId }),
    getPretestStatus: async (courseId: string): Promise<PretestStatus> =>
      (await get<ApiEnvelope<PretestStatus>>(`/exercise/pretest/status?course_id=${encodeURIComponent(courseId)}`)).data,
    getPretestQuestions: async (courseId: string): Promise<Question[]> =>
      (await get<ApiEnvelope<Question[]>>(`/exercise/pretest/questions?course_id=${encodeURIComponent(courseId)}`)).data,
    submitPretest: (courseId: string, answers: { questionId: string; answer: string | string[] }[]): Promise<PretestResponse> =>
      post("/exercise/pretest/submit", { courseId, answers }),
  },

  progress: {
    getMastery: async (): Promise<KpMastery[]> => (await get<ApiEnvelope<KpMastery[]>>("/progress/mastery")).data,
    getScores: async (): Promise<UserScore | null> => (await get<ApiEnvelope<UserScore | null>>("/progress/scores")).data,
    getRecommendations: async (): Promise<Recommendation[]> =>
      (await get<ApiEnvelope<Recommendation[]>>("/progress/recommendations")).data,
  },

  community: {
    list: async (): Promise<CommunityQuestion[]> =>
      (await get<ApiEnvelope<CommunityQuestion[]>>("/community/questions")).data,
    getDetail: async (id: string): Promise<CommunityDetail> =>
      (await get<ApiEnvelope<CommunityDetail>>(`/community/questions/${encodeURIComponent(id)}`)).data,
    createAnswer: (data: { questionId: string; content: string }): Promise<{ success: boolean; data?: { id: string; answerCount: number } }> =>
      post("/community/answers", data),
    likeQuestion: async (questionId: string): Promise<{ liked: boolean; likeCount: number }> =>
      (await post<ApiEnvelope<{ liked: boolean; likeCount: number }>>(`/community/questions/${encodeURIComponent(questionId)}/like`)).data,
    likeAnswer: async (answerId: string): Promise<{ liked: boolean; likeCount: number }> =>
      (await post<ApiEnvelope<{ liked: boolean; likeCount: number }>>(`/community/answers/${encodeURIComponent(answerId)}/like`)).data,
    deleteAnswer: async (answerId: string): Promise<{ questionId: string; answerCount: number }> =>
      (await del<ApiEnvelope<{ questionId: string; answerCount: number }>>(`/community/answers/${encodeURIComponent(answerId)}`)).data,
    create: async (data: { title: string; description: string; tags: string[] }): Promise<CommunityQuestion> =>
      (await post<ApiEnvelope<CommunityQuestion>>("/community/questions", data)).data,
  },

  feedback: {
    list: async (): Promise<Feedback[]> => (await get<ApiEnvelope<Feedback[]>>("/feedbacks")).data,
    create: (data: { title: string; description: string; category: string }): Promise<{ success: boolean }> =>
      post("/feedbacks", data),
  },

  wrongQuestions: {
    list: async (): Promise<WrongQuestion[]> =>
      (await get<ApiEnvelope<WrongQuestion[]>>("/exercise/wrong-questions")).data,
    delete: async (recordId: string): Promise<{ success: boolean }> =>
      del(`/exercise/wrong-questions/${encodeURIComponent(recordId)}`),
  },

  admin: {
    getUsers: async (): Promise<User[]> => (await get<ApiEnvelope<User[]>>("/admin/users")).data,
    deleteUser: (userId: string): Promise<{ success: boolean }> => del(`/admin/users/${encodeURIComponent(userId)}`),
    setUserStatus: (userId: string, isActive: boolean): Promise<{ success: boolean; data?: { id: string; isActive: boolean; accountStatus: User["accountStatus"] } }> =>
      put(`/admin/users/${encodeURIComponent(userId)}/status`, { isActive }),
    restoreUser: (userId: string): Promise<{ success: boolean; data?: { id: string; isActive: boolean; accountStatus: User["accountStatus"] } }> =>
      put(`/admin/users/${encodeURIComponent(userId)}/restore`),
    getPosts: async (): Promise<CommunityQuestion[]> => (await get<ApiEnvelope<CommunityQuestion[]>>("/admin/posts")).data,
    deletePost: (postId: string): Promise<{ success: boolean }> => del(`/admin/posts/${encodeURIComponent(postId)}`),
    pinPost: (postId: string): Promise<{ success: boolean }> => put(`/admin/posts/${encodeURIComponent(postId)}/pin`),
    addPosition: async (data: { name: string; description: string; icon: string }): Promise<Position> =>
      (await post<ApiEnvelope<Position>>("/admin/positions", data)).data,
    createDefaultCourse: async (positionId: string): Promise<Course> =>
      (await post<ApiEnvelope<Course>>(`/admin/positions/${encodeURIComponent(positionId)}/default-course`)).data,
    addCourse: async (positionId: string, data: { name: string; description: string }): Promise<Course> =>
      (await post<ApiEnvelope<Course>>(`/admin/positions/${encodeURIComponent(positionId)}/courses`, data)).data,
    deleteCourse: async (courseId: string): Promise<{ materials: number; knowledgePoints: number; questions: number; chunks: number }> =>
      (await del<ApiEnvelope<{ materials: number; knowledgePoints: number; questions: number; chunks: number }>>(`/admin/courses/${encodeURIComponent(courseId)}`)).data,
    deletePosition: (positionId: string): Promise<{ success: boolean }> =>
      del(`/admin/positions/${encodeURIComponent(positionId)}`),
    getCourseRagStatus: async (courseId: string): Promise<CourseRagStatus> =>
      (await get<ApiEnvelope<CourseRagStatus>>(`/admin/courses/${encodeURIComponent(courseId)}/rag-status`)).data,
    getCourseChunks: async (courseId: string): Promise<CourseChunk[]> =>
      (await get<ApiEnvelope<CourseChunk[]>>(`/admin/courses/${encodeURIComponent(courseId)}/chunks`)).data,
    reindexCourse: async (courseId: string): Promise<{ chunks: number; embeddingSuccess: number; indexedAt: string }> =>
      (await post<ApiEnvelope<{ chunks: number; embeddingSuccess: number; indexedAt: string }>>(`/admin/courses/${encodeURIComponent(courseId)}/reindex`)).data,
    uploadKnowledgeBase: async (courseId: string, file: File): Promise<ApiEnvelope<{ materialId: string; pages: number; chunks: number; knowledgePoints: number; embeddingSuccess: number; indexedAt: string }>> =>
      uploadFile("/upload/knowledge-base", file, { course_id: courseId }),
    uploadQuestionBank: async (courseId: string, file: File): Promise<ApiEnvelope<{ materialId: string; questions: number; imported: number; updated: number }>> =>
      uploadFile("/upload/question-bank", file, { course_id: courseId }),
    getUserScores: async (): Promise<UserScore[]> => (await get<ApiEnvelope<UserScore[]>>("/admin/scores")).data,
    getFeedbacks: async (): Promise<Feedback[]> => (await get<ApiEnvelope<Feedback[]>>("/admin/feedbacks")).data,
    resolveFeedback: (feedbackId: string, reply: string): Promise<{ success: boolean }> =>
      put(`/admin/feedbacks/${encodeURIComponent(feedbackId)}?reply=${encodeURIComponent(reply)}`),
  },
};


