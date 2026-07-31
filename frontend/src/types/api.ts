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
}

export interface QASource {
  chapter: string;
  page: number;
  snippet: string;
  chunkId: string;
}

export interface QAResponse {
  answer: string;
  sources: QASource[];
}

export interface Step {
  index: number;
  instruction: string;
  description: string;
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
  preTest: number;
  postTest: number;
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







