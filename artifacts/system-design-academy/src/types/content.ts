// ======================================================
// Shared Content Types
// Used throughout the academy
// ======================================================

export type Difficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type SectionType =
  | "text"
  | "callout"
  | "code"
  | "image"
  | "mermaid"
  | "react-flow"
  | "table"
  | "quiz"
  | "interview"
  | "summary";

export interface LessonSection {
  id: string;
  type: SectionType;
  title: string;
  content: string;

  language?: string;
  image?: string;
  caption?: string;
}

export interface InterviewQuestion {
  question: string;
  answer?: string;
}

export interface LessonSummary {
  title: string;
  description: string;
}

export interface Lesson {

  id: number;

  slug: string;

  module: string;

  title: string;

  subtitle: string;

  difficulty: Difficulty;

  duration: string;

  description: string;

  objectives: string[];

  prerequisites: string[];

  sections: LessonSection[];

  interviewQuestions: InterviewQuestion[];

  summary: LessonSummary;

  previousLesson?: number;

  nextLesson?: number;

}