export type Phase = {
  id: string;
  index: string;
  name: string;
  range: string;
  description: string;
  color: string;
  lessons: string[];
};

export type RoadmapCardContent = {
  icon: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  lessons: string;
  progress: number;
};

export const phases: Phase[] = [
  {
    id: 'foundations', index: '01', name: 'Foundations', range: '01—08',
    description: 'The mental models and vocabulary that make every later decision legible.', color: '#a8d8e9',
    lessons: ['How the web actually works', 'Latency, throughput, and the numbers that matter', 'The anatomy of a request', 'Storage primitives: files, rows, and documents', 'APIs as contracts', 'Reliability, availability, and durability', 'A practical capacity planning primer', 'Designing your first service boundary'],
  },
  {
    id: 'building-blocks', index: '02', name: 'Core Building Blocks', range: '09—24',
    description: 'The primitives you reach for before reaching for a pattern.', color: '#c9f36b',
    lessons: ['Relational databases under load', 'Indexes and query shape', 'Transactions and isolation', 'Replication: the first copy', 'Partitioning and sharding', 'Caching without surprises', 'Cache invalidation strategies', 'Queues and asynchronous work', 'Pub/sub and event streams', 'Object storage and blob delivery', 'CDNs and edge caching', 'Rate limiting algorithms', 'Search indexes and retrieval', 'Distributed locks and leases', 'Idempotency and safe retries', 'A service boundary workshop'],
  },
  {
    id: 'distributed', index: '03', name: 'Distributed Systems', range: '25—40',
    description: 'Reasoning about failure, time, and state when one machine is not enough.', color: '#ff7251',
    lessons: ['The fallacies of distributed computing', 'Clocks, ordering, and causality', 'Consistency models explained', 'CAP without the slogans', 'Quorums and read repair', 'Leader election', 'Consensus: what it solves', 'Gossip protocols', 'Replication lag and read-your-writes', 'Split brain and fencing', 'Backpressure and load shedding', 'Circuit breakers and bulkheads', 'Exactly-once is a product decision', 'Sagas and distributed transactions', 'Building an event-driven workflow', 'Failure injection lab'],
  },
  {
    id: 'patterns', index: '04', name: 'Architecture Patterns', range: '41—52',
    description: 'Composable shapes for turning good primitives into a coherent system.', color: '#e7bd72',
    lessons: ['Monoliths with clean seams', 'Modular monolith architecture', 'Service-oriented architecture', 'Microservices: the trade-off ledger', 'Hexagonal architecture', 'CQRS in practice', 'Event sourcing, carefully', 'Data mesh and ownership', 'The strangler migration', 'Multi-tenant system patterns', 'Designing for graceful degradation', 'Choosing a pattern under constraints'],
  },
  {
    id: 'production', index: '05', name: 'Production Systems', range: '53—62',
    description: 'The operational layer that turns architecture diagrams into dependable software.', color: '#9fc89f',
    lessons: ['Observability as a design input', 'Metrics that explain user impact', 'Structured logs and trace context', 'SLOs, SLIs, and error budgets', 'Capacity planning for growth', 'Deployments without downtime', 'Safe migrations and rollbacks', 'Incident response and learning', 'Security boundaries and threat modeling', 'The production readiness review'],
  },
  {
    id: 'ai', index: '06', name: 'AI System Design', range: '63—70',
    description: 'New system constraints for retrieval, inference, and probabilistic behavior.', color: '#c7b5e7',
    lessons: ['The shape of an AI product', 'Inference latency and cost budgets', 'Embeddings and vector indexes', 'Retrieval-augmented generation', 'Evaluation before optimization', 'Prompt, model, and data routing', 'Safety, privacy, and human review', 'Operating an AI feature in production'],
  },
  {
    id: 'case-studies', index: '07', name: 'System Design Case Studies', range: '71—80',
    description: 'Ten full builds that make the abstract feel like a system you could ship.', color: '#7eb7c9',
    lessons: ['Design a URL shortener', 'Design a global rate limiter', 'Design a news feed', 'Design a chat platform', 'Design a video streaming service', 'Design a ride matching system', 'Design a collaborative editor', 'Design a payments ledger', 'Design a metrics and logs platform', 'Design a global file storage system'],
  },
];

export const roadmapCardContent: Record<Phase['id'], RoadmapCardContent> = {
  foundations: { icon: '📘', description: 'Master the core principles behind every scalable system, including scalability, consistency, availability, and architecture fundamentals.', difficulty: 'Beginner', estimatedTime: '~4 Hours', lessons: '8 Lessons', progress: 38 },
  'building-blocks': { icon: '🌐', description: 'Learn the essential technologies that power modern backend systems, including networking, APIs, caching, databases, Redis, Kafka, CDN, and Service Discovery.', difficulty: 'Beginner -> Intermediate', estimatedTime: '~10 Hours', lessons: '16 Lessons', progress: 26 },
  distributed: { icon: '⚡', description: 'Understand how distributed applications remain reliable across multiple servers using consistency models, distributed coordination, messaging, fault tolerance, and resilience patterns.', difficulty: 'Intermediate -> Advanced', estimatedTime: '~12 Hours', lessons: '16 Lessons', progress: 18 },
  patterns: { icon: '🏗', description: 'Explore the architectural patterns behind scalable applications, including Monoliths, Microservices, Event-Driven Architecture, CQRS, Event Sourcing, and Serverless.', difficulty: 'Intermediate', estimatedTime: '~8 Hours', lessons: '12 Lessons', progress: 14 },
  production: { icon: '🚀', description: 'Learn the practices required to build production-ready applications, including security, monitoring, observability, deployments, disaster recovery, Kubernetes, and scaling.', difficulty: 'Advanced', estimatedTime: '~7 Hours', lessons: '10 Lessons', progress: 10 },
  ai: { icon: '🤖', description: 'Learn how modern AI-powered systems are built using LLMs, RAG, Vector Databases, AI Agents, MCP, Memory Systems, and evaluation techniques.', difficulty: 'Advanced', estimatedTime: '~5 Hours', lessons: '8 Lessons', progress: 8 },
  'case-studies': { icon: '🎯', description: "Apply everything you've learned by designing real-world systems such as WhatsApp, Netflix, Uber, Instagram, Google Drive, BookMyShow, and Payment Systems.", difficulty: 'Expert', estimatedTime: '~15 Hours', lessons: '10 Lessons', progress: 6 },
};
