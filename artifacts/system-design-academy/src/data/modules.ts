// ======================================================
// Module Metadata
// Used by Module Pages
// ======================================================

import { Difficulty, Lesson } from "../types/content";

export interface LessonPreview {
  id: number;
  slug: string;
  title: string;
  duration: string;
  difficulty: Difficulty;
}

export interface Module {

  id: string;

  title: string;

  subtitle: string;

  overview: string;

  estimatedTime: string;

  lessonCount: number;

  difficulty: Difficulty;

  color: string;

  icon: string;

  learningOutcomes: string[];

  prerequisites: string[];

  lessons: LessonPreview[];

}

export const modules: Record<string, Module> = {

  foundations: {

    id: "foundations",

    title: "Foundations",

    subtitle: "Build the mindset of a System Designer",

    overview:
      "This module introduces the essential concepts that every backend engineer must understand before designing scalable systems. You'll learn how to think in terms of requirements, scalability, availability, consistency, and capacity planning.",

    estimatedTime: "4 Hours",

    lessonCount: 8,

    difficulty: "Beginner",

    color: "#A8D8E9",

    icon: "📘",

    learningOutcomes: [

      "Understand what System Design actually is",

      "Differentiate HLD and LLD",

      "Gather Functional & Non-Functional Requirements",

      "Estimate users, storage, QPS and bandwidth",

      "Understand scalability",

      "Understand availability and reliability",

      "Understand consistency models",

      "Understand CAP theorem"

    ],

    prerequisites: [

      "Basic programming",

      "HTTP basics",

      "Databases (basic knowledge)"

    ],

    lessons: [

      {
        id: 1,
        slug: "what-is-system-design",
        title: "What is System Design?",
        duration: "20 mins",
        difficulty: "Beginner",
      },

      {
        id: 2,
        slug: "hld-vs-lld",
        title: "HLD vs LLD",
        duration: "20 mins",
        difficulty: "Beginner",
      },

      {
        id: 3,
        slug: "functional-vs-non-functional-requirements",
        title: "Functional vs Non-Functional Requirements",
        duration: "25 mins",
        difficulty: "Beginner",
      },

      {
        id: 4,
        slug: "estimating-scale",
        title: "Estimating Scale",
        duration: "30 mins",
        difficulty: "Beginner",
      },

      {
        id: 5,
        slug: "scalability",
        title: "Scalability",
        duration: "25 mins",
        difficulty: "Beginner",
      },

      {
        id: 6,
        slug: "availability-and-reliability",
        title: "Availability & Reliability",
        duration: "20 mins",
        difficulty: "Beginner",
      },

      {
        id: 7,
        slug: "consistency-models",
        title: "Consistency Models",
        duration: "30 mins",
        difficulty: "Intermediate",
      },

      {
        id: 8,
        slug: "cap-theorem",
        title: "CAP Theorem",
        duration: "35 mins",
        difficulty: "Intermediate",
      }

    ]

  }

};