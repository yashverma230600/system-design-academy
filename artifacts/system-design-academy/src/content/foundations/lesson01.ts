import { Lesson } from "../../types/content";

const lesson01: Lesson = {
  id: 1,

  slug: "what-is-system-design",

  module: "foundations",

  title: "What is System Design?",

  subtitle: "Designing systems that scale reliably",

  difficulty: "Beginner",

  duration: "20 mins",

  description:
    "Learn what System Design really means, why it is important, and how engineers use it to build applications that serve millions of users.",

  objectives: [
    "Understand the meaning of System Design",
    "Know why companies ask System Design interviews",
    "Differentiate coding from architecture",
    "Understand scalability at a high level",
    "Recognize the building blocks of modern systems"
  ],

  prerequisites: [
    "Basic programming knowledge",
    "Basic understanding of web applications"
  ],

  sections: [
    {
      id: "introduction",
      type: "text",
      title: "Introduction",
      content:
        "System Design is the process of designing software systems that are scalable, reliable, maintainable, and efficient. Instead of focusing on algorithms, it focuses on how different components work together."
    },

    {
      id: "why-it-matters",
      type: "text",
      title: "Why It Matters",
      content:
        "As applications grow from hundreds to millions of users, architectural decisions become more important than individual pieces of code. Good system design allows applications to handle increasing traffic while remaining fast and reliable."
    },

    {
      id: "core-concepts",
      type: "text",
      title: "Core Concepts",
      content:
        "Every system consists of clients, servers, databases, caches, queues, networking, storage, and monitoring. A System Designer decides how these components interact to satisfy both functional and non-functional requirements."
    },

    {
      id: "real-world-example",
      type: "text",
      title: "Real-world Example",
      content:
        "When you upload a photo to Instagram, your request passes through a Load Balancer, API servers, object storage, databases, caches, and content delivery networks before it appears on your profile."
    },

    {
      id: "interview-focus",
      type: "text",
      title: "Interview Focus",
      content:
        "Interviewers want to evaluate how you think, not whether you know every technology. They look for structured problem solving, trade-off analysis, and communication."
    }
  ],

  interviewQuestions: [
    {
      question: "What is System Design?"
    },
    {
      question: "Why is System Design important?"
    },
    {
      question: "What are the major components of a distributed system?"
    },
    {
      question: "When do engineers start thinking about scalability?"
    }
  ],

  summary: {
    title: "Key Takeaways",
    description:
      "System Design is about making architectural decisions that allow software systems to scale, remain reliable, and continue serving users as traffic and complexity grow."
  },

  previousLesson: undefined,

  nextLesson: 2
};

export default lesson01;