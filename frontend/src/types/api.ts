export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  accountStatus?: "active" | "banned" | "cancelled";
  avatar?: string;
}

export interface Position {
  id: string;
  name: string;
  description: string;
  icon: string;
  studentCount: number;
  courseCount: number;
}

export interface Course {
  id: string;
  positionId: string;
  name: string;
  description: string;
  chapterCount: number;
  knowledgePointCount: number;
  materialCount: number;
  questionCount?: number;
}

export interface QASource {
  chunkId: string;
  materialId?: string;
  courseId?: string;
  filename?: string;
  chapter: string;
  page: number;
  content?: string;
  snippet: string;
  score?: number;
  retrievalMode?: "vector" | "keyword" | "none";
}

export interface QARagTraceStep {
  title: string;
  detail: string;
}

export interface QARagTrace {
  question: string;
  courseId: string;
  usedContext: boolean;
  retrievalMode: "vector" | "keyword" | "none";
  sourceCount: number;
  steps: QARagTraceStep[];
  topSources?: QASource[];
  answerPreview?: string;
}

export interface QAResponse {
  answer: string;
  sources: QASource[];
  ragTrace?: QARagTrace;
  usedContext?: boolean;
  retrievalMode?: "vector" | "keyword" | "none";
  sessionId?: string;
}

export interface CourseRagStatus {
  courseId: string;
  status: "empty" | "parsed" | "partial" | "indexed";
  statusText: string;
  materialCount: number;
  chunkCount: number;
  knowledgePointCount: number;
  questionCount: number;
  embeddingSuccess: number;
  latestUpload: string;
}

export interface CourseChunk {
  id: string;
  materialId: string;
  filename: string;
  chunkIndex: number;
  chapter: string;
  page: number;
  content: string;
  hasEmbedding: boolean;
}

export interface Step {
  index: number;
  title?: string;
  instruction: string;
  description: string;
  commands?: { language?: string; code: string; comment?: string }[];
  commandComment?: string;
  notes?: string[];
  warnings?: string[];
  verification?: string;
  expectedResult?: string;
  hasImage: boolean;
  screenshotHint?: string;
  visualType?: string;
  imagePrompt?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface PracticalResponse {
  title: string;
  intent?: string;
  source?: "llm" | "fallback";
  summary?: string;
  prerequisites?: string[];
  steps: Step[];
}

export type QuestionType = "single" | "multiple" | "judge";

export interface Question {
  id: string;
  type: QuestionType;
  stem: string;
  options: { key: string; text: string }[];
  answer: string | string[];
  explanation: string;
  knowledgePointId: string;
}

export interface ExerciseResult {
  questionId: string;
  correct: boolean;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface ExerciseResponse {
  score: number;
  total: number;
  results: ExerciseResult[];
}

export interface PretestStatus {
  completed: boolean;
  questionCount: number;
  score?: number | null;
  total?: number;
  correct?: number;
}

export interface PretestResponse extends ExerciseResponse {
  percent: number;
  alreadyCompleted?: boolean;
}

export interface KpMastery {
  id: string;
  name: string;
  masteryProb: number;
  chapter: string;
  questionCount: number;
  correctCount: number;
}

export interface ExerciseKnowledgePoint {
  id: string;
  name: string;
  chapter: string;
  masteryProb: number | null;
  answeredQuestionCount: number;
  availableQuestionCount: number;
}

export type RecommendationType = "material" | "exercise" | "community";

export interface Recommendation {
  type: RecommendationType;
  title: string;
  description: string;
  link?: string;
  reason: string;
}

export interface CommunityQuestion {
  id: string;
  title: string;
  description: string;
  tags: string[];
  authorName: string;
  createdAt: string;
  answerCount: number;
  likeCount: number;
  hasLiked?: boolean;
  hasGoodAnswer: boolean;
  hasAggregateAnswer?: boolean;
}

export interface CommunityAnswer {
  id: string;
  questionId: string;
  content: string;
  authorName: string;
  createdAt: string;
  likeCount: number;
  hasLiked?: boolean;
  canDelete?: boolean;
  isAdopted: boolean;
  isGood: boolean;
}

export interface CommunityDetail {
  question: CommunityQuestion;
  answers: CommunityAnswer[];
  aggregateAnswer?: {
    content: string;
    source: "llm" | "fallback";
    updatedAt: string;
  } | null;
  aggregateStatus?: "pending" | "generating" | "ready" | "failed";
}

export interface WrongQuestion {
  id: string;
  stem: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  knowledgePoint: string;
  courseName: string;
  courseId: string;
  wrongDate: string;
  options: { key: string; text: string }[];
}

export type FeedbackCategory = "bug" | "feature" | "content" | "other";
export type FeedbackStatus = "pending" | "resolved";

export interface Feedback {
  id: string;
  userId: string;
  authorName: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  adminReply?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface UserScore {
  userId: string;
  username: string;
  email: string;
  courseId?: string;
  courseName?: string;
  preTest: number | null;
  postTest: number | null;
  preTestTotal?: number;
  preTestCorrect?: number;
  postTestTotal?: number;
  postTestCorrect?: number;
  scoreHistory: { date: string; score: number; total?: number; correct?: number }[];
}

export interface ChapterSection {
  title: string;
  content: string;
}

export interface Chapter {
  id: string;
  courseId: string;
  name: string;
  description: string;
  knowledgePointIds: string[];
  sections: ChapterSection[];
  duration: string;
}







