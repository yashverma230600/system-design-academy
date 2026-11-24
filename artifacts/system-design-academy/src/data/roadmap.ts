// ======================================================
// Roadmap Overview
// Used ONLY by the homepage roadmap section
// ======================================================

import { Difficulty } from "../types/content";

export interface RoadmapModule {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;

  difficulty: Difficulty;

  lessonCount: number;

  estimatedTime: string;

  range: string;

  color: string;

  icon: string;

  path: string;
}

export const roadmap: RoadmapModule[] = [
  {
    id: "foundations",
    index: "01",
    title: "Foundations",
    subtitle: "Build the fundamentals of System Design",
    description:
      "Understand the core principles behind scalable systems including scalability, availability, consistency, estimation, and architectural thinking.",

    difficulty: "Beginner",

    lessonCount: 8,

    estimatedTime: "4 Hours",

    range: "01—08",

    color: "#A8D8E9",

    icon: "📘",

    path: "/module/foundations",
  },

  {
    id: "building-blocks",
    index: "02",
    title: "Core Building Blocks",
    subtitle: "Master the technologies every backend engineer uses",
    description:
      "Learn networking, APIs, databases, caching, Redis, Kafka, CDN, object storage, and service discovery.",

    difficulty: "Beginner",

    lessonCount: 16,

    estimatedTime: "10 Hours",

    range: "09—24",

    color: "#C9F36B",

    icon: "🌐",

    path: "/module/building-blocks",
  },

  {
    id: "distributed",
    index: "03",
    title: "Distributed Systems",
    subtitle: "Learn how systems work across multiple machines",
    description:
      "Understand consistency, distributed coordination, retries, circuit breakers, consensus algorithms, and resilience patterns.",

    difficulty: "Intermediate",

    lessonCount: 16,

    estimatedTime: "12 Hours",

    range: "25—40",

    color: "#FF7251",

    icon: "⚡",

    path: "/module/distributed",
  },

  {
    id: "architecture",
    index: "04",
    title: "Architecture Patterns",
    subtitle: "Design scalable backend architectures",
    description:
      "Explore Monoliths, Microservices, Event-Driven Architecture, CQRS, Event Sourcing, Serverless, and workflow orchestration.",

    difficulty: "Intermediate",

    lessonCount: 12,

    estimatedTime: "8 Hours",

    range: "41—52",

    color: "#E7BD72",

    icon: "🏗",

    path: "/module/architecture",
  },

  {
    id: "production",
    index: "05",
    title: "Production Systems",
    subtitle: "Build reliable systems that survive production",
    description:
      "Learn security, observability, monitoring, deployments, disaster recovery, Kubernetes, and production readiness.",

    difficulty: "Advanced",

    lessonCount: 10,

    estimatedTime: "7 Hours",

    range: "53—62",

    color: "#9FC89F",

    icon: "🚀",

    path: "/module/production",
  },

  {
    id: "ai",
    index: "06",
    title: "AI System Design",
    subtitle: "Design modern AI-powered applications",
    description:
      "Build AI products using LLMs, RAG, Vector Databases, AI Agents, MCP, Memory Systems, and evaluation pipelines.",

    difficulty: "Advanced",

    lessonCount: 8,

    estimatedTime: "5 Hours",

    range: "63—70",

    color: "#C7B5E7",

    icon: "🤖",

    path: "/module/ai",
  },

  {
    id: "case-studies",
    index: "07",
    title: "System Design Case Studies",
    subtitle: "Apply everything to real-world systems",
    description:
      "Design production-scale systems including WhatsApp, Netflix, Uber, Instagram, Google Drive, BookMyShow, and Payment Systems.",

    difficulty: "Advanced",

    lessonCount: 10,

    estimatedTime: "15 Hours",

    range: "71—80",

    color: "#7EB7C9",

    icon: "🎯",

    path: "/module/case-studies",
  },
];