import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Code2,
  Database,
  ExternalLink,
  Globe2,
  Github,
  Layers3,
  Mail,
  Menu,
  Network,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Server,
  Send,
  Terminal,
  X,
  Zap,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import {
  phases as systemDesignPhases,
  roadmapCardContent as systemDesignRoadmapCardContent,
  coreBuildingBlocksLessons as systemDesignCoreBuildingBlocksLessons,
} from '@/content/system-design';
import NotFound from '@/pages/not-found';
import InterviewRoadmap from '@/pages/interview-roadmap';
import { kafkaGuide, redisGuide } from '@/content/interview-roadmaps';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Phase = {
  id: string;
  index: string;
  name: string;
  range: string;
  description: string;
  color: string;
  lessons: string[];
};

type CoreLesson = {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  overview: string;
  learn: string[];
  why: string;
  diagram?: string;
  curriculum?: {
    specTitle: string;
    level: string;
    readTime: string;
    prerequisites: string[];
    objectives: string[];
    plainLanguage: string;
    howItWorks: string[];
    keyTerms: string[];
    diagrams: {
      caption: string;
      animate: string;
      steps: { from: string; to: string; label: string; detail: string }[];
    }[];
    workedExample: string;
    tradeOffs: string[];
    commonMistakes: string[];
    interviewQuestions: { question: string; answers: string[] }[];
    quickChecks: { question: string; answer: string }[];
    relatedTopics: string[];
  };
};

const phases: Phase[] = [
  {
    id: 'foundations',
    index: '01',
    name: 'Foundations',
    range: '01—08',
    description: 'The mental models and vocabulary that make every later decision legible.',
    color: '#a8d8e9',
    lessons: [
      'How the web actually works',
      'Latency, throughput, and the numbers that matter',
      'The anatomy of a request',
      'Storage primitives: files, rows, and documents',
      'APIs as contracts',
      'Reliability, availability, and durability',
      'A practical capacity planning primer',
      'Designing your first service boundary',
    ],
  },
  {
    id: 'building-blocks',
    index: '02',
    name: 'Core Building Blocks',
    range: '09—24',
    description: 'The primitives you reach for before reaching for a pattern.',
    color: '#c9f36b',
    lessons: [
      'Relational databases under load',
      'Indexes and query shape',
      'Transactions and isolation',
      'Replication: the first copy',
      'Partitioning and sharding',
      'Caching without surprises',
      'Cache invalidation strategies',
      'Queues and asynchronous work',
      'Pub/sub and event streams',
      'Object storage and blob delivery',
      'CDNs and edge caching',
      'Rate limiting algorithms',
      'Search indexes and retrieval',
      'Distributed locks and leases',
      'Idempotency and safe retries',
      'A service boundary workshop',
    ],
  },
  {
    id: 'distributed',
    index: '03',
    name: 'Distributed Systems',
    range: '25—40',
    description: 'Reasoning about failure, time, and state when one machine is not enough.',
    color: '#ff7251',
    lessons: [
      'The fallacies of distributed computing',
      'Clocks, ordering, and causality',
      'Consistency models explained',
      'CAP without the slogans',
      'Quorums and read repair',
      'Leader election',
      'Consensus: what it solves',
      'Gossip protocols',
      'Replication lag and read-your-writes',
      'Split brain and fencing',
      'Backpressure and load shedding',
      'Circuit breakers and bulkheads',
      'Exactly-once is a product decision',
      'Sagas and distributed transactions',
      'Building an event-driven workflow',
      'Failure injection lab',
    ],
  },
  {
    id: 'patterns',
    index: '04',
    name: 'Architecture Patterns',
    range: '41—52',
    description: 'Composable shapes for turning good primitives into a coherent system.',
    color: '#e7bd72',
    lessons: [
      'Monoliths with clean seams',
      'Modular monolith architecture',
      'Service-oriented architecture',
      'Microservices: the trade-off ledger',
      'Hexagonal architecture',
      'CQRS in practice',
      'Event sourcing, carefully',
      'Data mesh and ownership',
      'The strangler migration',
      'Multi-tenant system patterns',
      'Designing for graceful degradation',
      'Choosing a pattern under constraints',
    ],
  },
  {
    id: 'production',
    index: '05',
    name: 'Production Systems',
    range: '53—62',
    description: 'The operational layer that turns architecture diagrams into dependable software.',
    color: '#9fc89f',
    lessons: [
      'Observability as a design input',
      'Metrics that explain user impact',
      'Structured logs and trace context',
      'SLOs, SLIs, and error budgets',
      'Capacity planning for growth',
      'Deployments without downtime',
      'Safe migrations and rollbacks',
      'Incident response and learning',
      'Security boundaries and threat modeling',
      'The production readiness review',
    ],
  },
  {
    id: 'ai',
    index: '06',
    name: 'AI System Design',
    range: '63—70',
    description: 'New system constraints for retrieval, inference, and probabilistic behavior.',
    color: '#c7b5e7',
    lessons: [
      'The shape of an AI product',
      'Inference latency and cost budgets',
      'Embeddings and vector indexes',
      'Retrieval-augmented generation',
      'Evaluation before optimization',
      'Prompt, model, and data routing',
      'Safety, privacy, and human review',
      'Operating an AI feature in production',
    ],
  },
  {
    id: 'case-studies',
    index: '07',
    name: 'System Design Case Studies',
    range: '71—80',
    description: 'Ten full builds that make the abstract feel like a system you could ship.',
    color: '#7eb7c9',
    lessons: [
      'Design a URL shortener',
      'Design a global rate limiter',
      'Design a news feed',
      'Design a chat platform',
      'Design a video streaming service',
      'Design a ride matching system',
      'Design a collaborative editor',
      'Design a payments ledger',
      'Design a metrics and logs platform',
      'Design a global file storage system',
    ],
  },
];

const roadmapCardContent: Record<
  Phase['id'],
  {
    icon: string;
    description: string;
    difficulty: string;
    estimatedTime: string;
    lessons: string;
    progress: number;
  }
> = {
  foundations: {
    icon: '📘',
    description:
      'Master the core principles behind every scalable system, including scalability, consistency, availability, and architecture fundamentals.',
    difficulty: 'Beginner',
    estimatedTime: '~4 Hours',
    lessons: '8 Lessons',
    progress: 38,
  },
  'building-blocks': {
    icon: '🌐',
    description:
      'Learn the essential technologies that power modern backend systems, including networking, APIs, caching, databases, Redis, Kafka, CDN, and Service Discovery.',
    difficulty: 'Beginner -> Intermediate',
    estimatedTime: '~10 Hours',
    lessons: '16 Lessons',
    progress: 26,
  },
  distributed: {
    icon: '⚡',
    description:
      'Understand how distributed applications remain reliable across multiple servers using consistency models, distributed coordination, messaging, fault tolerance, and resilience patterns.',
    difficulty: 'Intermediate -> Advanced',
    estimatedTime: '~12 Hours',
    lessons: '16 Lessons',
    progress: 18,
  },
  patterns: {
    icon: '🏗',
    description:
      'Explore the architectural patterns behind scalable applications, including Monoliths, Microservices, Event-Driven Architecture, CQRS, Event Sourcing, and Serverless.',
    difficulty: 'Intermediate',
    estimatedTime: '~8 Hours',
    lessons: '12 Lessons',
    progress: 14,
  },
  production: {
    icon: '🚀',
    description:
      'Learn the practices required to build production-ready applications, including security, monitoring, observability, deployments, disaster recovery, Kubernetes, and scaling.',
    difficulty: 'Advanced',
    estimatedTime: '~7 Hours',
    lessons: '10 Lessons',
    progress: 10,
  },
  ai: {
    icon: '🤖',
    description:
      'Learn how modern AI-powered systems are built using LLMs, RAG, Vector Databases, AI Agents, MCP, Memory Systems, and evaluation techniques.',
    difficulty: 'Advanced',
    estimatedTime: '~5 Hours',
    lessons: '8 Lessons',
    progress: 8,
  },
  'case-studies': {
    icon: '🎯',
    description:
      "Apply everything you've learned by designing real-world systems such as WhatsApp, Netflix, Uber, Instagram, Google Drive, BookMyShow, and Payment Systems.",
    difficulty: 'Expert',
    estimatedTime: '~15 Hours',
    lessons: '10 Lessons',
    progress: 6,
  },
};

const topics = [
  { icon: Network, label: 'Distributed systems', title: 'Design for the failure you can name.', body: 'Consensus, replication, queues, and the subtle cost of time across a network.' },
  { icon: Layers3, label: 'Architecture', title: 'Make the trade-off visible.', body: 'A practiced way to compare boundaries, data ownership, and migration paths.' },
  { icon: Terminal, label: 'Production thinking', title: 'The diagram is only the beginning.', body: 'SLOs, rollout plans, observability, and what happens at 02:17 on a Tuesday.' },
];

const resources = [
  { type: 'Field guide', title: 'The Capacity Planning Canvas', detail: 'A one-page worksheet for turning traffic assumptions into honest architecture.', action: 'Get the canvas' },
  { type: 'Reference sheet', title: 'Failure Modes Index', detail: 'A field guide to the failure patterns hiding inside common distributed primitives.', action: 'Open reference' },
  { type: 'Practice set', title: 'Case Study Prompts', detail: 'Ten prompts with constraints designed to expose how you really reason.', action: 'Start practicing' },
];

const roadmapEntries = [
  {
    id: 'system-design',
    label: 'System Design',
    meta: '80 topics · 7 phases',
    status: 'Current',
    href: '/#roadmap',
    active: true,
  },
  {
    id: 'java-roadmap',
    label: 'Java Roadmap',
    meta: 'Add later',
    status: 'Coming soon',
    active: false,
  },
  {
    id: 'kafka',
    label: 'Kafka Roadmap',
    meta: '20 questions · 5 topics',
    status: 'Available',
    href: '/roadmaps/kafka',
    active: true,
  },
  {
    id: 'redis',
    label: 'Redis Roadmap',
    meta: '20 questions · 5 topics',
    status: 'Available',
    href: '/roadmaps/redis',
    active: true,
  },
  {
    id: 'demo-roadmap',
    label: 'Demo Roadmap',
    meta: 'Add later',
    status: 'Coming soon',
    active: false,
  },
] as const;

const coreBuildingBlocksLessons: CoreLesson[] = [
  {
    id: '09',
    title: 'Networking Fundamentals (DNS, TCP/IP, HTTP, HTTPS)',
    difficulty: 'Beginner',
    duration: '45 min',
    overview: 'Networking is the foundation of every distributed system. Before a request reaches your application, it travels through DNS, TCP/IP, routers, and HTTP protocols.',
    learn: ['How the Internet works', 'DNS resolution', 'TCP vs UDP', 'HTTP & HTTPS', 'TLS/SSL basics', 'Request lifecycle'],
    why: 'Every API call, database request, and microservice communication depends on networking fundamentals.',
  },
  {
    id: '10',
    title: 'REST APIs & API Design',
    difficulty: 'Beginner',
    overview: 'REST APIs define how applications communicate with each other. A well-designed API is easy to use, scalable, versioned, and secure.',
    learn: ['REST principles', 'HTTP methods', 'Status codes', 'Resource design', 'API versioning', 'Pagination', 'Idempotency'],
    why: 'Every backend system exposes APIs. Poor API design creates long-term maintenance problems.',
  },
  {
    id: '11',
    title: 'Load Balancers',
    difficulty: 'Beginner',
    overview: 'A load balancer distributes incoming traffic across multiple servers so that no single machine becomes overloaded.',
    learn: ['Why load balancing is needed', 'Layer 4 vs Layer 7', 'Round Robin', 'Least Connections', 'Health checks', 'Sticky sessions'],
    why: 'Without load balancing, your application cannot scale horizontally.',
  },
  {
    id: '12',
    title: 'Reverse Proxy',
    difficulty: 'Beginner',
    overview: 'A reverse proxy sits in front of backend servers and forwards client requests while hiding internal infrastructure.',
    learn: ['Reverse proxy vs forward proxy', 'SSL termination', 'Compression', 'Caching', 'Request routing'],
    why: 'Reverse proxies improve security, performance, and simplify infrastructure.',
  },
  {
    id: '13',
    title: 'API Gateway',
    difficulty: 'Intermediate',
    overview: 'An API gateway acts as the single entry point for all client requests in a microservices architecture.',
    learn: ['Authentication', 'Authorization', 'Rate limiting', 'Routing', 'Request aggregation', 'API versioning'],
    why: 'API gateways simplify client communication and centralize cross-cutting concerns.',
  },
  {
    id: '14',
    title: 'Caching Fundamentals',
    difficulty: 'Intermediate',
    overview: 'Caching stores frequently accessed data closer to users to reduce latency and database load.',
    learn: ['Cache Aside', 'Read Through', 'Write Through', 'Write Back', 'TTL', 'Cache invalidation', 'Cache stampede'],
    why: 'Caching often provides the biggest performance improvement with minimal infrastructure changes.',
  },
  {
    id: '15',
    title: 'Redis Deep Dive',
    difficulty: 'Intermediate',
    overview: 'Redis is an in-memory data store used for caching, distributed locking, rate limiting, sessions, queues, and leaderboards.',
    learn: ['Redis data structures', 'Expiration', 'Pub/Sub', 'Streams', 'Distributed locks', 'Rate limiting', 'Performance optimization'],
    why: 'Redis appears in almost every modern backend architecture.',
  },
  {
    id: '16',
    title: 'Databases (SQL vs NoSQL)',
    difficulty: 'Intermediate',
    overview: 'Choosing the right database is one of the most important design decisions. Different workloads require different storage solutions.',
    learn: ['Relational databases', 'NoSQL databases', 'ACID', 'BASE', 'Transactions', 'Use-case comparison'],
    why: 'Every scalable application depends on choosing the right database.',
  },
  {
    id: '17',
    title: 'Database Indexing',
    difficulty: 'Intermediate',
    overview: 'Indexes improve query performance by allowing databases to locate data efficiently instead of scanning full tables.',
    learn: ['B-Tree indexes', 'Hash indexes', 'Composite indexes', 'Covering indexes', 'Query optimization'],
    why: 'Proper indexing can reduce query time from seconds to milliseconds.',
  },
  {
    id: '18',
    title: 'Replication',
    difficulty: 'Intermediate',
    overview: 'Replication creates multiple copies of data across servers to improve availability, durability, and read scalability.',
    learn: ['Primary-replica architecture', 'Synchronous replication', 'Asynchronous replication', 'Read replicas', 'Failover'],
    why: 'Replication prevents downtime and improves read performance.',
  },
  {
    id: '19',
    title: 'Sharding & Partitioning',
    difficulty: 'Advanced',
    overview: 'As databases outgrow a single machine, data must be distributed across multiple servers.',
    learn: ['Horizontal partitioning', 'Vertical partitioning', 'Sharding strategies', 'Hot partitions', 'Rebalancing'],
    why: 'Internet-scale systems cannot run on a single database server.',
  },
  {
    id: '20',
    title: 'Object Storage (Amazon S3)',
    difficulty: 'Intermediate',
    overview: 'Object storage is designed for large binary files such as images, videos, documents, and backups.',
    learn: ['Buckets', 'Objects', 'Metadata', 'Pre-signed URLs', 'Versioning', 'Lifecycle policies'],
    why: 'Do not store user-uploaded files inside your application server.',
  },
  {
    id: '21',
    title: 'CDN (Content Delivery Network)',
    difficulty: 'Intermediate',
    overview: 'A CDN caches static content closer to users around the world, reducing latency and improving user experience.',
    learn: ['Edge servers', 'Cache hierarchy', 'Global distribution', 'Cache invalidation', 'Origin servers'],
    why: 'CDNs allow applications to serve content globally with low latency.',
  },
  {
    id: '22',
    title: 'Message Queues',
    difficulty: 'Intermediate',
    overview: 'Message queues enable asynchronous communication between services, improving reliability and reducing coupling.',
    learn: ['Producers', 'Consumers', 'Queues', 'Acknowledgements', 'Retry mechanisms', 'Dead Letter Queues'],
    why: 'Asynchronous processing is essential for scalable distributed systems.',
  },
  {
    id: '23',
    title: 'Kafka Deep Dive',
    difficulty: 'Advanced',
    overview: 'Apache Kafka is a distributed event streaming platform capable of processing massive event volumes with durability and scalability.',
    learn: ['Topics', 'Partitions', 'Brokers', 'Consumer groups', 'Offsets', 'Replication', 'Delivery guarantees'],
    why: 'Kafka powers real-time pipelines, analytics, and event-driven architectures.',
  },
  {
    id: '24',
    title: 'Service Discovery',
    difficulty: 'Intermediate',
    overview: 'In microservices environments, instances are constantly created and destroyed. Service discovery helps services locate each other dynamically.',
    learn: ['Client-side discovery', 'Server-side discovery', 'Service registry', 'Health checks', 'Dynamic routing', 'Auto scaling'],
    why: 'Without service discovery, autoscaling and dynamic infrastructure are difficult to manage.',
  },
];

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 22 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function Brand() {
  return (
    <a href="#top" className="flex items-center gap-3" data-testid="link-brand">
      <span className="grid h-9 w-9 place-items-center bg-[#c9f36b] text-[#071a27]">
        <span className="mono text-[11px] font-bold">SDA</span>
      </span>
      <span className="display text-[15px] font-bold tracking-[-.03em] text-[#f3efe6]">System Design<br />Academy</span>
    </a>
  );
}

function Navigation({ isContentPage = false }: { isContentPage?: boolean }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const selectedRoadmap = roadmapEntries.find((entry) => entry.active && entry.href === location);
  const items = isContentPage
    ? []
    : [['Topics', 'topics'], ['About', 'about'], ['Resources', 'resources']];
  return (
    <header className="relative z-40 border-b border-white/10 bg-[#071a27]">
      <div className="mx-auto flex max-w-[1380px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Brand />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {!isContentPage && <a href="/content" className="mono text-[10px] uppercase tracking-[.16em] text-[#d5e0dd]/75 transition-colors hover:text-[#c9f36b]" data-testid="link-nav-content">Content</a>}
          {items.map(([label, id]) => <a key={id} href={`#${id}`} className="mono text-[10px] uppercase tracking-[.16em] text-[#d5e0dd]/75 transition-colors hover:text-[#c9f36b]" data-testid={`link-nav-${id}`}>{label}</a>)}
        </nav>
        {isContentPage ? (
          <a href="/" className="hidden items-center gap-2 border border-[#c9f36b]/50 px-4 py-2.5 mono text-[10px] uppercase tracking-[.15em] text-[#c9f36b] transition-colors hover:bg-[#c9f36b] hover:text-[#071a27] sm:flex" data-testid="link-nav-home">Back to home <ArrowUpRight size={13} /></a>
        ) : (
          <a href="#contact" className="hidden items-center gap-2 border border-[#c9f36b]/50 px-4 py-2.5 mono text-[10px] uppercase tracking-[.15em] text-[#c9f36b] transition-colors hover:bg-[#c9f36b] hover:text-[#071a27] sm:flex" data-testid="link-nav-start">Start the roadmap <ArrowUpRight size={13} /></a>
        )}
        <button type="button" className="text-[#f3efe6] md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open && <div className="border-t border-white/10 bg-[#071a27] px-5 py-4 md:hidden">
        {!isContentPage && <a onClick={() => setOpen(false)} href="/content" className="block border-b border-white/10 py-3 mono text-[10px] uppercase tracking-[.16em] text-[#d5e0dd]/75" data-testid="link-mobile-nav-content">Content</a>}
        {items.map(([label, id]) => <a onClick={() => setOpen(false)} key={id} href={`#${id}`} className="block border-b border-white/10 py-3 mono text-[10px] uppercase tracking-[.16em] text-[#d5e0dd]/75" data-testid={`link-mobile-nav-${id}`}>{label}</a>)}
        {isContentPage ? (
          <a onClick={() => setOpen(false)} href="/" className="mt-3 block bg-[#c9f36b] px-4 py-3 text-center mono text-[10px] uppercase tracking-[.15em] text-[#071a27]" data-testid="link-mobile-home">Back to home</a>
        ) : (
          <a onClick={() => setOpen(false)} href="#contact" className="mt-3 block bg-[#c9f36b] px-4 py-3 text-center mono text-[10px] uppercase tracking-[.15em] text-[#071a27]" data-testid="link-mobile-start">Start the roadmap</a>
        )}
      </div>}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1380px] px-5 py-3 sm:px-8 lg:px-12">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group flex min-h-11 items-center gap-3 rounded-md border border-[#c9f36b]/35 px-4 text-sm font-semibold text-[#f3efe6] hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9f36b]" data-testid="button-roadmaps">
                <BookOpen size={17} className="text-[#c9f36b]" />
                <span>{selectedRoadmap?.label ?? 'Roadmaps'}</span>
                <ChevronDown size={16} className="text-[#c9f36b] transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={8} className="w-[320px] max-w-[calc(100vw-40px)] border-white/15 bg-[#102632] p-2 text-[#f3efe6] shadow-xl">
              <DropdownMenuLabel className="mono px-3 py-2 text-[10px] uppercase text-[#c9f36b]">Learning roadmaps</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              {roadmapEntries.map((roadmap) => (
                <DropdownMenuItem key={roadmap.id} disabled={!roadmap.active} asChild={roadmap.active} className="min-h-14 gap-3 px-3 py-3 focus:bg-white/10 focus:text-[#f3efe6]">
                  {roadmap.active ? (
                    <a href={roadmap.href} data-testid={`link-roadmap-${roadmap.id}`} aria-current={selectedRoadmap?.id === roadmap.id ? 'page' : undefined}>
                      {roadmap.id === 'redis' ? <Database className="text-[#ff7251]" /> : roadmap.id === 'kafka' ? <Radio className="text-[#a8d8e9]" /> : <Layers3 className="text-[#c9f36b]" />}
                      <span className="flex-1"><span className="block font-semibold">{roadmap.label}</span><span className="block text-xs text-[#d5e0dd]/65">{roadmap.meta}</span></span>
                      {selectedRoadmap?.id === roadmap.id ? <Check size={16} /> : <ArrowUpRight size={16} />}
                    </a>
                  ) : (
                    <><Code2 /><span className="flex-1"><span className="block font-semibold">{roadmap.label}</span><span className="block text-xs text-[#d5e0dd]/65">Coming soon</span></span></>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function LessonOneContent() {
  const coreComponents = ['Client', 'DNS', 'Load Balancer', 'API Gateway', 'Microservices', 'Cache', 'Database', 'Message Queue', 'Object Storage', 'CDN'];
  const systemGoals = ['Scale with demand', 'Remain reliable', 'Stay highly available', 'Protect user data', 'Respond quickly', 'Recover from failures', 'Control cost', 'Stay maintainable'];
    const interviewQuestions: { question: string; answer: ReactNode }[] = [
     {
      question: 'What is a system, and what makes a system distributed?',
      answer: <><p>A system is a collection of components working together toward a common goal. In an e-commerce app, the frontend displays products, the backend processes requests, the database stores data, and a payment service handles transactions.</p><p className="mt-3">A distributed system runs those components on multiple independent machines connected over a network, rather than one machine doing everything.</p><pre className="mt-4 overflow-x-auto bg-[#071a27] p-4 mono text-[11px] leading-6 text-[#f3efe6]">{`            User
            │
            ▼
        Load Balancer
         │      │
         ▼      ▼
      Server 1  Server 2
         │      │
         └──┬───┘
           ▼
        Database`}</pre><p className="mt-3">We distribute systems to handle more users, improve availability and fault tolerance, scale parts independently, and reduce response time.</p></>,
     },
     {
      question: 'Why does an architecture that works for 10 users fail at 100 million users?',
      answer: <><p>With 10 users, a single application and database have plenty of CPU, memory, storage, and network capacity. At 100 million users, every component can become a bottleneck.</p><ul className="mt-3 list-disc space-y-1 pl-5"><li>One server cannot process millions of concurrent requests.</li><li>A single database is overwhelmed by reads and writes.</li><li>Images, videos, and logs exhaust storage.</li><li>Network traffic saturates bandwidth and increases latency.</li><li>A single server is a single point of failure.</li></ul><p className="mt-3">Large-scale systems address this with load balancers, multiple application servers, Redis caching, database replication and sharding, CDNs, and message queues.</p></>,
     },
     {
      question: 'What is the difference between High-Level Design and Low-Level Design?',
      answer: <><p><strong>High-Level Design (HLD)</strong> defines the overall architecture: services, APIs, databases, caches, queues, infrastructure, and scaling strategy.</p><pre className="mt-4 overflow-x-auto bg-[#071a27] p-4 mono text-[11px] leading-6 text-[#f3efe6]">{`Client
    │
  API Gateway
    │
  User Service
    │
  PostgreSQL`}</pre><p className="mt-3"><strong>Low-Level Design (LLD)</strong> defines how one service is implemented: classes, objects, methods, interfaces, database tables, algorithms, and design patterns.</p><pre className="mt-4 overflow-x-auto bg-[#071a27] p-4 mono text-[11px] leading-6 text-[#f3efe6]">{`OrderController
       │
  OrderService
       │
  OrderRepository`}</pre></>,
     },
     {
      question: 'Which components would you choose first when designing a large-scale application?',
      answer: <><p>The exact architecture depends on requirements, but a common starting path is:</p><pre className="mt-4 overflow-x-auto bg-[#071a27] p-4 mono text-[11px] leading-6 text-[#f3efe6]">{`Client
    │
  DNS
    │
  Load Balancer
    │
  API Gateway
    │
  Application Servers
    │
  Cache
    │
  Database
    │
  Object Storage`}</pre><ul className="mt-3 list-disc space-y-1 pl-5"><li>Load balancers distribute traffic across healthy servers.</li><li>API gateways centralize authentication, routing, and rate limiting.</li><li>Application servers own business logic.</li><li>Redis caches frequently read data.</li><li>Databases persist application data; object storage holds large files.</li><li>Message queues process asynchronous work such as email and notifications.</li></ul></>,
     },
     {
      question: 'How do load balancers, caches, and databases help a system scale?',
      answer: <><p><strong>Load balancers</strong> spread requests across multiple application servers, prevent overload, remove unhealthy servers, and enable horizontal scaling.</p><pre className="mt-4 overflow-x-auto bg-[#071a27] p-4 mono text-[11px] leading-6 text-[#f3efe6]">{`Users
    │
    ▼
  Load Balancer
   │    │    │
   ▼    ▼    ▼
  S1   S2   S3`}</pre><p className="mt-3"><strong>Caches</strong> keep frequently requested data in memory. A cache hit avoids a database query, which lowers latency, infrastructure cost, and database load.</p><p className="mt-3"><strong>Databases</strong> provide durable storage for users, orders, products, transactions, and messages. At scale, replication adds read capacity, sharding distributes data, indexing accelerates queries, and caching reduces repeated reads.</p></>,
     },
  ];

  return (
    <section id="lesson-01" className="bg-[#f3efe6] px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[980px]">
        <Reveal>
          <div className="mono mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[.2em] text-[#ff7251]"><span className="h-px w-8 bg-[#ff7251]" />01 / Lesson</div>
          <h1 className="display text-5xl leading-[.94] text-[#071a27] sm:text-7xl">What is <span className="text-[#ff7251]">System Design?</span></h1>
          <div className="mt-8 grid gap-4 border-y border-[#071a27]/15 py-5 sm:grid-cols-3">
            <div><div className="mono text-[9px] uppercase tracking-[.16em] text-[#071a27]/45">Estimated time</div><div className="mt-2 text-sm font-bold text-[#071a27]">20 minutes</div></div>
            <div><div className="mono text-[9px] uppercase tracking-[.16em] text-[#071a27]/45">Difficulty</div><div className="mt-2 text-sm font-bold text-[#071a27]">Beginner</div></div>
            <div><div className="mono text-[9px] uppercase tracking-[.16em] text-[#071a27]/45">Prerequisites</div><div className="mt-2 text-sm font-bold text-[#071a27]">Basic web and API familiarity</div></div>
          </div>
        </Reveal>

        <div className="mt-12 space-y-12 text-[#071a27]">
          <Reveal delay={0.03}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">📖 What is a System?</div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">A system is a collection of components working together to achieve a goal. WhatsApp, Netflix, Amazon, UPI, and Gmail look like single applications, but internally they contain many services with distinct responsibilities.</p>
              <div className="mt-5 overflow-x-auto bg-[#071a27] p-6 text-[#f3efe6]"><pre className="mono text-[11px] leading-6 text-[#f3efe6]/85">{`Instagram

        User
          │
          ▼
     Load Balancer
          │
     ┌────┴────┐
     ▼         ▼
API Server   API Server
     │
     ▼
 Database`}</pre></div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">Every block owns one responsibility. Together, those blocks form the system.</p>
            </section>
          </Reveal>

          <Reveal delay={0.06}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">🤔 What is System Design?</div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">System Design is the work of deciding what components are needed, how they communicate, where data is stored, how requests flow, how the system scales, and how failures are handled before implementation begins.</p>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">Rather than designing classes and methods, you design the full architecture that lets an application serve real users reliably.</p>
            </section>
          </Reveal>

          <Reveal delay={0.09}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">📈 Why Do We Need System Design?</div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">A Notes App for 10 users can run on one server and one database. At 100 million users, the server overloads, the database slows down, storage fills up, bandwidth is exhausted, and one crash can affect everyone.</p>
              <div className="mt-5 overflow-x-auto bg-[#071a27] p-6 text-[#f3efe6]"><pre className="mono text-[11px] leading-6 text-[#f3efe6]/85">{`Users
      │
      ▼
Load Balancer
   │      │
Server  Server
   │      │
 Cache
   │
Database Cluster`}</pre></div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">System Design gives you the tools to make this transition deliberately rather than waiting for scaling problems to become outages.</p>
            </section>
          </Reveal>

          <Reveal delay={0.12}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">🎯 Goals of System Design</div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {systemGoals.map((concept) => (
                  <div key={concept} className="border border-[#071a27]/15 bg-white/50 px-4 py-3 text-sm font-semibold text-[#071a27]/85">{concept}</div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.15}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">🌍 Example: Designing WhatsApp</div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">Questions such as where messages live, how they arrive instantly, how presence and typing indicators work, how offline users receive notifications, and how devices synchronize are all System Design problems.</p>
            </section>
          </Reveal>

          <Reveal delay={0.18}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">🏗 High-Level Design (HLD)</div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">High-Level Design answers: what major components will the system have? It focuses on services, databases, APIs, caches, queues, and external systems, without implementation details.</p>
              <div className="mt-5 overflow-x-auto bg-[#071a27] p-6 text-[#f3efe6]">
                <pre className="mono text-[11px] leading-6 text-[#f3efe6]/85">{`          Client
             │
       API Gateway
             │
 ┌───────────┼───────────┐
User      Chat      Media
Service   Service   Service
      │        │        │
 PostgreSQL Redis    S3`}</pre>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.21}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">⚙ Low-Level Design (LLD)</div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">Low-Level Design answers: how is each service implemented? This is where classes, objects, interfaces, database schemas, design patterns, and algorithms become important.</p>
              <div className="mt-5 overflow-x-auto bg-[#071a27] p-6 text-[#f3efe6]"><pre className="mono text-[11px] leading-6 text-[#f3efe6]/85">{`ChatController
       │
ChatService
       │
MessageRepository`}</pre></div>
            </section>
          </Reveal>

          <Reveal delay={0.24}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">🔑 HLD vs LLD</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="border border-[#071a27]/15 bg-white px-4 py-4"><div className="mono text-[9px] uppercase tracking-[.14em] text-[#071a27]/50">High-Level Design</div><p className="mt-2 text-sm leading-6 text-[#071a27]/75">Entire architecture, services, databases, APIs, scaling, and infrastructure.</p></div>
                <div className="border border-[#071a27]/15 bg-white px-4 py-4"><div className="mono text-[9px] uppercase tracking-[.14em] text-[#071a27]/50">Low-Level Design</div><p className="mt-2 text-sm leading-6 text-[#071a27]/75">Internal implementation, classes, methods, business logic, algorithms, and code.</p></div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.27}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">🧠 Common Components You&apos;ll Learn</div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">These building blocks appear in nearly every large-scale system:</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {coreComponents.map((component) => <div key={component} className="border border-dashed border-[#071a27]/20 bg-[#f9f6ef] px-4 py-3 text-sm text-[#071a27]/75">{component}</div>)}
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.24}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">❓ Common Interview Questions</div>
              <div className="mt-5 space-y-3">
                {interviewQuestions.map((item, index) => (
                  <details key={item.question} className="group border border-[#071a27]/15 bg-[#f9f6ef] text-sm leading-6 text-[#071a27]/78">
                    <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 marker:content-none">
                      <span className="mono mt-[2px] text-[10px] text-[#ff7251]">0{index + 1}</span>
                      <span className="flex-1 font-semibold text-[#071a27]/85">{item.question}</span>
                      <span className="mono text-[14px] text-[#ff7251] transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <div className="border-t border-[#071a27]/12 px-4 py-4 text-[#071a27]/75">
                      <div className="ml-7 max-w-[760px]">{item.answer}</div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.27}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">📝 Summary</div>
              <ul className="mt-4 space-y-2 pl-5 text-base leading-8 text-[#071a27]/78">
                <li>A system is a collection of components working together toward a goal.</li>
                <li>System Design focuses on architecture, scalability, reliability, and fault tolerance.</li>
                <li>HLD defines major components and their interactions; LLD defines how each component is implemented.</li>
                <li>As traffic grows, architecture becomes as important as individual code.</li>
              </ul>
            </section>
          </Reveal>

          <Reveal delay={0.3}>
            <section className="border-t border-[#071a27]/15 pt-8">
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#071a27]/55">➡ Next Lesson</div>
              <h3 className="display mt-3 text-3xl text-[#071a27]">HLD vs LLD</h3>
              <p className="mt-3 text-sm leading-6 text-[#071a27]/65">Learn the difference between designing an application’s architecture and designing its internal implementation details.</p>
            </section>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

type LessonFlow = NonNullable<CoreLesson['curriculum']>['diagrams'][number];

function InteractiveFlowDiagram({ diagram, flow }: { diagram?: string; flow?: LessonFlow }) {
  const steps = flow?.steps ?? (diagram ?? '')
    .split(/\n|->/)
    .map((step) => step.trim())
    .filter((step) => step && !/^[|v/\\]+$/.test(step))
    .map((label) => ({ from: '', to: '', label, detail: '' }));
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || steps.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveStep((currentStep) => (currentStep + 1) % steps.length);
    }, 1100);

    return () => window.clearInterval(timer);
  }, [isPlaying, steps.length]);

  if (steps.length === 0) return null;

  return (
    <div className="mt-5 overflow-hidden border border-[#071a27]/15 bg-[#071a27] p-4 text-[#f3efe6] sm:p-5" data-testid="interactive-flow-diagram">
      <div className="flex items-center justify-between gap-4">
        <div className="mono text-[9px] uppercase tracking-[.16em] text-[#c9f36b]">Interactive request flow</div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setIsPlaying(!isPlaying)} className="grid h-7 w-7 place-items-center border border-[#f3efe6]/20 text-[#f3efe6]/75 transition-colors hover:border-[#c9f36b] hover:text-[#c9f36b]" aria-label={isPlaying ? 'Pause flow animation' : 'Play flow animation'} data-testid="button-flow-toggle">
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <button type="button" onClick={() => { setActiveStep(0); setIsPlaying(true); }} className="grid h-7 w-7 place-items-center border border-[#f3efe6]/20 text-[#f3efe6]/75 transition-colors hover:border-[#c9f36b] hover:text-[#c9f36b]" aria-label="Restart flow animation" data-testid="button-flow-restart">
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          return (
            <div key={`${step}-${index}`} className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={() => { setActiveStep(index); setIsPlaying(false); }} className={`min-w-[88px] border px-3 py-2 text-center mono text-[10px] leading-4 transition-colors ${isActive ? 'border-[#c9f36b] bg-[#c9f36b] text-[#071a27]' : 'border-[#f3efe6]/20 bg-[#f3efe6]/5 text-[#f3efe6]/72 hover:border-[#f3efe6]/50'}`} aria-pressed={isActive}>
                  {step.label}
              </button>
              {index < steps.length - 1 && (
                <div className="relative h-px w-8 shrink-0 overflow-hidden bg-[#f3efe6]/20">
                  <motion.span className="absolute -top-1.5 h-3 w-3 rounded-full bg-[#c9f36b]" animate={isPlaying && index === activeStep ? { x: [0, 30], opacity: [0, 1, 0] } : { x: 0, opacity: 0 }} transition={{ duration: 0.85, ease: 'easeInOut' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {flow && <>
        <p className="mt-3 text-xs leading-6 text-[#f3efe6]/55">{steps[activeStep].from} <ArrowRight className="mx-1 inline" size={12} /> {steps[activeStep].to}</p>
        <p className="mt-1 text-sm leading-6 text-[#f3efe6]/80">{steps[activeStep].detail}</p>
      </>}
      <p className="mt-3 mono text-[9px] uppercase tracking-[.13em] text-[#f3efe6]/45">Active step: {steps[activeStep].label}</p>
    </div>
  );
}

function LessonCurriculumDetails({ lesson }: { lesson: NonNullable<CoreLesson['curriculum']> }) {
  return (
    <div className="mt-8 space-y-8 border-t border-[#071a27]/12 pt-7" data-testid="lesson-curriculum-09">
      <section>
        <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">{lesson.specTitle}</div>
        <p className="mt-2 mono text-[10px] uppercase tracking-[.12em] text-[#071a27]/50">{lesson.level} · Read time: {lesson.readTime} · Prerequisites: {lesson.prerequisites.join(', ')}</p>
      </section>

      <section>
        <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">Learning objectives</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#071a27]/78">{lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
      </section>

      <section>
        <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">Plain-language explanation</div>
        <p className="mt-3 text-base leading-8 text-[#071a27]/78">{lesson.plainLanguage}</p>
      </section>

      <section>
        <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">How it works</div>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#071a27]/78">{lesson.howItWorks.map((step) => <li key={step}>{step}</li>)}</ol>
      </section>

      <section>
        <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">Key terms</div>
        <ul className="mt-3 flex flex-wrap gap-2">{lesson.keyTerms.map((term) => <li key={term} className="border border-[#071a27]/15 bg-white/70 px-3 py-1.5 text-xs text-[#071a27]/75">{term}</li>)}</ul>
      </section>

      <section>
        <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">Diagrams and interactive flows</div>
        <div className="mt-4 space-y-5">{lesson.diagrams.map((diagram, index) => <div key={diagram.caption} className="border border-[#071a27]/15 bg-[#f9f6ef] p-4 sm:p-5">
          <p className="text-sm font-semibold leading-6 text-[#071a27]">{diagram.caption}</p>
          <InteractiveFlowDiagram flow={diagram} />
          <p className="mt-3 text-xs leading-6 text-[#071a27]/65"><span className="font-bold">Animate:</span> {diagram.animate}</p>
          <p className="mt-2 mono text-[9px] uppercase tracking-[.12em] text-[#071a27]/45">Diagram {index + 1} flow steps</p>
        </div>)}</div>
      </section>

      <section>
        <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">Worked example</div>
        <p className="mt-3 text-sm leading-7 text-[#071a27]/78">{lesson.workedExample}</p>
      </section>

      <section>
        <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">Trade-offs and decision rules</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#071a27]/78">{lesson.tradeOffs.map((tradeOff) => <li key={tradeOff}>{tradeOff}</li>)}</ul>
      </section>

      <section>
        <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">Common mistakes</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#071a27]/78">{lesson.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul>
      </section>

      <section>
        <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">Interview questions</div>
        <ol className="mt-3 space-y-4">{lesson.interviewQuestions.map((item) => <li key={item.question} className="text-sm font-semibold leading-7 text-[#071a27]"><p>{item.question}</p><ul className="mt-1 list-disc space-y-1 pl-5 font-normal text-[#071a27]/75">{item.answers.map((answer) => <li key={answer}>{answer}</li>)}</ul></li>)}</ol>
      </section>

      <section>
        <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">Quick checks</div>
        <dl className="mt-3 space-y-3">{lesson.quickChecks.map((check) => <div key={check.question} className="border-l-2 border-[#c9f36b] pl-4 text-sm leading-7"><dt className="font-semibold text-[#071a27]">{check.question}</dt><dd className="text-[#071a27]/70">{check.answer}</dd></div>)}</dl>
      </section>

      <section>
        <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">Related topics</div>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#071a27]/70">{lesson.relatedTopics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
      </section>
    </div>
  );
}

function PartTwoContent() {
  return (
    <section id="content-top" className="bg-[#f3efe6] px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1080px]">
        <Reveal>
          <div className="mono mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[.2em] text-[#ff7251]"><span className="h-px w-8 bg-[#ff7251]" />Part II / Core Building Blocks</div>
          <h1 className="display text-5xl leading-[.94] text-[#071a27] sm:text-7xl">Core Building Blocks <span className="text-[#ff7251]">(09-24)</span></h1>
          <p className="mt-6 max-w-[860px] text-base leading-8 text-[#071a27]/75">Learn every building block by following one request from your phone to a server and back. Each lesson adds one component to the same journey.</p>
        </Reveal>

        <div className="mt-12 grid gap-5">
          {systemDesignCoreBuildingBlocksLessons.map((lesson, index) => (
            <Reveal key={lesson.id} delay={index * 0.03}>
              <details className="group border border-[#071a27]/15 bg-white/60" data-testid={`card-part2-${lesson.id}`}>
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4 p-5 marker:content-none sm:p-7">
                  <div className="min-w-0">
                    <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">Lesson {lesson.id}</div>
                    <h2 className="display mt-2 text-3xl leading-tight text-[#071a27]">{lesson.title}</h2>
                    <p className="mt-3 max-w-[760px] text-sm leading-7 text-[#071a27]/65">{lesson.overview}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="mono border border-[#071a27]/20 px-2 py-1 text-[9px] uppercase tracking-[.14em] text-[#071a27]/65">{lesson.difficulty}</span>
                    {lesson.duration && <span className="mono border border-[#071a27]/20 px-2 py-1 text-[9px] uppercase tracking-[.14em] text-[#071a27]/65">{lesson.duration}</span>}
                    <span className="mono ml-1 text-lg text-[#ff7251] transition-transform group-open:rotate-45">+</span>
                  </div>
                </summary>

                <div className="border-t border-[#071a27]/12 px-5 py-6 sm:px-7 sm:py-7">
                  <div className="max-w-[820px]">
                    <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">Explanation</div>
                    <p className="mt-3 text-base leading-8 text-[#071a27]/78">{lesson.overview}</p>
                    {lesson.curriculum && <LessonCurriculumDetails lesson={lesson.curriculum} />}

                    {!lesson.curriculum && lesson.diagram && <InteractiveFlowDiagram diagram={lesson.diagram} />}

                    <div className="mt-7">
                      <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">Key concepts</div>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {lesson.learn.map((topic) => (
                          <li key={topic} className="border border-dashed border-[#071a27]/20 bg-[#f9f6ef] px-3 py-2 text-sm text-[#071a27]/75">{topic}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-7 border-l-2 border-[#c9f36b] bg-[#c9f36b]/10 px-4 py-4">
                      <div className="mono text-[10px] uppercase tracking-[.16em] text-[#071a27]/55">Why it matters</div>
                      <p className="mt-2 text-sm leading-7 text-[#071a27]/78">{lesson.why}</p>
                    </div>
                  </div>
                </div>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <section className="mt-12 border border-[#071a27]/15 bg-[#071a27] p-6 text-[#f3efe6] sm:p-8">
            <div className="mono text-[10px] uppercase tracking-[.16em] text-[#c9f36b]">Outcome of Part II</div>
            <p className="mt-4 text-sm leading-7 text-[#f3efe6]/82">By completing this section, learners understand the core infrastructure used in nearly every modern backend architecture: networking, APIs, traffic distribution, data storage and optimization, asynchronous communication, and reliability at scale.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/content" className="inline-flex items-center gap-2 border border-[#c9f36b]/50 px-4 py-2.5 mono text-[10px] uppercase tracking-[.14em] text-[#c9f36b] transition-colors hover:bg-[#c9f36b] hover:text-[#071a27]">Open Part I <ArrowUpRight size={13} /></a>
              <a href="/" className="inline-flex items-center gap-2 border border-[#f3efe6]/35 px-4 py-2.5 mono text-[10px] uppercase tracking-[.14em] text-[#f3efe6]/85 transition-colors hover:bg-[#f3efe6] hover:text-[#071a27]">Back to home <ArrowUpRight size={13} /></a>
            </div>
          </section>
        </Reveal>
      </div>
    </section>
  );
}

function LessonTwentyFiveContent() {
  return (
    <section id="lesson-25" className="bg-[#f3efe6] px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[980px]">
        <Reveal>
          <div className="mono mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[.2em] text-[#ff7251]"><span className="h-px w-8 bg-[#ff7251]" />03 / Distributed Systems</div>
          <h1 className="display text-5xl leading-[.94] text-[#071a27] sm:text-7xl">25. <span className="text-[#ff7251]">Consistent Hashing</span></h1>
          <div className="mt-8 grid gap-4 border-y border-[#071a27]/15 py-5 sm:grid-cols-2">
            <div><div className="mono text-[9px] uppercase tracking-[.16em] text-[#071a27]/45">Difficulty</div><div className="mt-2 text-sm font-bold text-[#071a27]">Intermediate</div></div>
            <div><div className="mono text-[9px] uppercase tracking-[.16em] text-[#071a27]/45">Duration</div><div className="mt-2 text-sm font-bold text-[#071a27]">35 min</div></div>
          </div>
        </Reveal>

        <div className="mt-12 space-y-12 text-[#071a27]">
          <Reveal delay={0.03}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">📖 Introduction</div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">Imagine you have a cache server storing user sessions. Initially your application has 4 Redis servers and keys are assigned through hashing.</p>
              <div className="mt-4 overflow-x-auto bg-[#071a27] p-4 text-[#f3efe6]"><pre className="mono text-[11px] leading-6 text-[#f3efe6]/85">{`User ID -> Hash Function -> Redis Server`}</pre></div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">Everything works until traffic grows and you add a 5th server. With normal hashing, almost every user key gets remapped, causing cache misses, overload, and slower responses.</p>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">This is exactly why consistent hashing was invented.</p>
            </section>
          </Reveal>

          <Reveal delay={0.06}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">🤔 Why Do We Need It?</div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">Normal hashing uses modulo server count:</p>
              <div className="mt-4 overflow-x-auto bg-[#071a27] p-4 text-[#f3efe6]"><pre className="mono text-[11px] leading-6 text-[#f3efe6]/85">{`hash(key) % number_of_servers

Servers = 4
User123 % 4 = Server2

Servers = 5
User123 % 5 = Server4`}</pre></div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">Changing N forces massive reshuffling. In large systems that can mean moving hundreds of millions of entries.</p>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">Consistent hashing maps both keys and servers onto a circular ring. Each key is assigned to the next server clockwise, so only nearby keys move when topology changes.</p>
            </section>
          </Reveal>

          <Reveal delay={0.09}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">🧠 How It Works</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="border border-[#071a27]/15 bg-white px-4 py-4"><div className="mono text-[9px] uppercase tracking-[.14em] text-[#071a27]/50">Step 1</div><p className="mt-2 text-sm leading-6 text-[#071a27]/75">Hash each server onto the ring (for example: Redis1=20, Redis2=85, Redis3=160, Redis4=300).</p></div>
                <div className="border border-[#071a27]/15 bg-white px-4 py-4"><div className="mono text-[9px] uppercase tracking-[.14em] text-[#071a27]/50">Step 2</div><p className="mt-2 text-sm leading-6 text-[#071a27]/75">Hash each key (for example: User123=92).</p></div>
                <div className="border border-[#071a27]/15 bg-white px-4 py-4"><div className="mono text-[9px] uppercase tracking-[.14em] text-[#071a27]/50">Step 3</div><p className="mt-2 text-sm leading-6 text-[#071a27]/75">Move clockwise to the first server. Here 92 maps to Redis3.</p></div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.12}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">🔄 What Happens When a Server Dies?</div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">If one server crashes, only the keys owned by that server remap to the next server on the ring. The rest of the keyspace remains untouched.</p>
            </section>
          </Reveal>

          <Reveal delay={0.15}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">⭐ Virtual Nodes</div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">Production systems do not place one point per physical server. They place many virtual nodes per server, which improves balance and prevents hotspots.</p>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">This is used in systems like Redis Cluster and Cassandra.</p>
            </section>
          </Reveal>

          <Reveal delay={0.18}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">🌍 Real-World Usage</div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {['Redis Cluster', 'Cassandra', 'DynamoDB', 'Akamai CDN', 'Memcached', 'Apache Ignite', 'Hazelcast'].map((item) => (
                  <div key={item} className="border border-dashed border-[#071a27]/20 bg-[#f9f6ef] px-4 py-3 text-sm text-[#071a27]/75">{item}</div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.21}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">⚖ Advantages</div>
              <ul className="mt-4 space-y-2 pl-5 text-base leading-8 text-[#071a27]/78">
                <li>Minimal data movement</li>
                <li>Easy horizontal scaling</li>
                <li>Better fault tolerance</li>
                <li>More uniform data distribution</li>
              </ul>
            </section>
          </Reveal>

          <Reveal delay={0.24}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">⚠ Limitations</div>
              <ul className="mt-4 space-y-2 pl-5 text-base leading-8 text-[#071a27]/78">
                <li>More complex than simple modulo hashing</li>
                <li>Needs virtual nodes for stronger balancing</li>
                <li>Does not provide replication by itself</li>
              </ul>
            </section>
          </Reveal>

          <Reveal delay={0.27}>
            <section>
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">💼 Interview Tip</div>
              <p className="mt-4 text-base leading-8 text-[#071a27]/78">Common question: why not just use hash(key) % N in large systems?</p>
              <blockquote className="mt-4 border-l-2 border-[#ff7251] pl-4 text-base leading-8 text-[#071a27]/78">Because changing N reassigns most keys. Consistent hashing maps servers and keys onto a ring so only a small subset of keys move when nodes are added or removed.</blockquote>
            </section>
          </Reveal>

          <Reveal delay={0.3}>
            <section className="border-t border-[#071a27]/15 pt-8">
              <div className="mono text-[10px] uppercase tracking-[.16em] text-[#ff7251]">📌 Summary</div>
              <ul className="mt-4 space-y-2 pl-5 text-base leading-8 text-[#071a27]/78">
                <li>Normal hashing causes massive reshuffling when server count changes.</li>
                <li>Consistent hashing minimizes movement by using a hash ring.</li>
                <li>Keys map to the next server clockwise.</li>
                <li>Virtual nodes improve balancing and reduce hotspots.</li>
                <li>Widely used in Redis, Cassandra, DynamoDB, and CDNs.</li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/" className="inline-flex items-center gap-2 border border-[#071a27]/35 px-4 py-2.5 mono text-[10px] uppercase tracking-[.14em] text-[#071a27] transition-colors hover:bg-[#071a27] hover:text-[#f3efe6]">Back to home <ArrowUpRight size={13} /></a>
                <a href="/content/core-building-blocks" className="inline-flex items-center gap-2 border border-[#071a27]/35 px-4 py-2.5 mono text-[10px] uppercase tracking-[.14em] text-[#071a27] transition-colors hover:bg-[#071a27] hover:text-[#f3efe6]">Open Part II <ArrowUpRight size={13} /></a>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HomeIntroduction() {
  const flowNodes = [
    { label: 'Client', icon: Globe2, color: 'bg-[#a8d8e9]' },
    { label: 'Gateway', icon: Network, color: 'bg-[#c9f36b]' },
    { label: 'Service', icon: Server, color: 'bg-[#ffb39f]' },
    { label: 'Database', icon: Database, color: 'bg-[#e7bd72]' },
  ];

  return (
    <section id="top" className="grid-paper bg-[#f3efe6] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-[1380px] items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
        <Reveal>
          <div className="mono mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[.2em] text-[#ff7251]"><span className="h-px w-8 bg-[#ff7251]" />A field guide to better systems</div>
          <h1 className="display max-w-[680px] text-5xl leading-[.94] text-[#071a27] sm:text-7xl">Understand the systems behind <span className="text-[#ff7251]">the software.</span></h1>
          <p className="mt-6 max-w-[520px] text-base leading-7 text-[#071a27]/65 sm:text-lg">Build practical system design judgment, one clear idea at a time. Follow the roadmap from first principles to real-world architecture.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#roadmap" className="inline-flex items-center gap-2 bg-[#071a27] px-5 py-3 mono text-[10px] uppercase tracking-[.14em] text-[#f3efe6] transition-colors hover:bg-[#0e2738]" data-testid="link-intro-roadmap">Explore the roadmap <ArrowUpRight size={14} /></a>
            <a href="/content" className="inline-flex items-center gap-2 border border-[#071a27]/30 px-5 py-3 mono text-[10px] uppercase tracking-[.14em] text-[#071a27] transition-colors hover:bg-[#071a27]/5" data-testid="link-intro-first-lesson">Start with lesson 01 <ArrowUpRight size={14} /></a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#071a27]/15 pt-5 mono text-[9px] uppercase tracking-[.12em] text-[#071a27]/55">
            <span><strong className="text-[#071a27]">80</strong> focused lessons</span>
            <span><strong className="text-[#071a27]">7</strong> learning phases</span>
            <span><strong className="text-[#071a27]">01</strong> system at a time</span>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="border border-[#071a27]/15 bg-[#fffdf8] p-5 sm:p-8" aria-label="A request moving through a system">
            <div className="flex items-center justify-between gap-3 border-b border-[#071a27]/12 pb-4">
              <span className="mono text-[9px] uppercase tracking-[.16em] text-[#071a27]/55">A request, end to end</span>
              <span className="mono text-[9px] uppercase tracking-[.12em] text-[#ff7251]">01 / 04</span>
            </div>
            <div className="mt-8 grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-3">
              {flowNodes.map((node, index) => {
                const Icon = node.icon;
                return (
                  <Fragment key={node.label}>
                    <div className="flex min-w-0 flex-col items-center gap-3 text-center">
                      <span className={`grid h-11 w-11 place-items-center ${node.color} text-[#071a27] sm:h-14 sm:w-14`}><Icon size={22} strokeWidth={1.5} /></span>
                      <span className="mono text-[8px] uppercase tracking-[.07em] text-[#071a27]/75 sm:text-[9px]">{node.label}</span>
                    </div>
                    {index < flowNodes.length - 1 && <ArrowUpRight size={13} className="text-[#ff7251]" aria-hidden="true" />}
                  </Fragment>
                );
              })}
            </div>
            <div className="mt-8 flex items-center gap-3 border-t border-[#071a27]/12 pt-4">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#6f9e53]" />
              <span className="mono text-[9px] uppercase tracking-[.1em] text-[#071a27]/55">One clear path through a complex system</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Roadmap() {
  const [selected, setSelected] = useState('foundations');
  const phase = systemDesignPhases.find((item) => item.id === selected) ?? systemDesignPhases[0];
  const selectedCard = systemDesignRoadmapCardContent[phase.id];

  const difficultyTone = (difficulty: string) => {
    if (difficulty.includes('Beginner') && difficulty.includes('Intermediate')) return 'text-[#7aa95b] bg-[#c9f36b]/20 border-[#c9f36b]/40';
    if (difficulty.includes('Beginner')) return 'text-[#6f9e53] bg-[#c9f36b]/20 border-[#c9f36b]/40';
    if (difficulty.includes('Intermediate') && difficulty.includes('Advanced')) return 'text-[#b06c3f] bg-[#ff7251]/15 border-[#ff7251]/35';
    if (difficulty.includes('Intermediate')) return 'text-[#9c7d49] bg-[#e7bd72]/20 border-[#e7bd72]/40';
    if (difficulty.includes('Expert')) return 'text-[#7f6a9f] bg-[#c7b5e7]/22 border-[#c7b5e7]/40';
    return 'text-[#946141] bg-[#ff7251]/15 border-[#ff7251]/35';
  };

  return (
    <section id="roadmap" className="grid-paper bg-[#f3efe6] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto max-w-[1380px]">
        <Reveal>
          <div className="flex flex-col justify-between gap-8 border-b border-[#071a27]/15 pb-10 lg:flex-row lg:items-end">
            <div>
              <div className="mono mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[.2em] text-[#ff7251]"><span className="h-px w-8 bg-[#ff7251]" />01 / Learning roadmap</div>
              <h2 className="display max-w-[720px] text-5xl leading-[.93] sm:text-7xl">A sequence built for<br /><span className="text-[#ff7251]">compounding clarity.</span></h2>
            </div>
            <p className="max-w-[315px] text-sm leading-6 text-[#071a27]/60">Seven deliberate movements from first principles to systems you can defend in a room full of staff engineers.</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-5">
            {systemDesignPhases.map((item, index) => {
              const card = systemDesignRoadmapCardContent[item.id];
              const isActive = selected === item.id;
              return (
                <Reveal key={item.id} delay={index * 0.05}>
                  <motion.button
                    type="button"
                    onClick={() => setSelected(item.id)}
                    whileHover={{ y: -4, scale: 1.006 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className={`roadmap-card w-full rounded-[18px] border p-6 text-left shadow-[0_8px_30px_rgba(7,26,39,0.06)] transition-all sm:p-7 ${isActive ? 'active border-[#071a27]/50 bg-[#071a27] text-[#f3efe6]' : 'border-[#071a27]/12 bg-[#fffdf8] text-[#071a27]'}`}
                    data-testid={`button-phase-${item.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border mono text-sm ${isActive ? 'border-[#f3efe6]/20 bg-[#f3efe6]/5 text-[#f3efe6]/85' : 'border-[#071a27]/15 bg-white text-[#071a27]/80'}`}>
                          {item.index}
                        </div>
                        <div className="min-w-0">
                          <div className="mono text-[10px] uppercase tracking-[.14em] opacity-55">{item.range}</div>
                          <h3 className="display mt-1 text-3xl leading-[.95] sm:text-4xl">{card.icon} {item.name}</h3>
                        </div>
                      </div>
                      <ArrowUpRight size={16} className={`${isActive ? 'text-[#c9f36b]' : 'text-[#071a27]/45'}`} />
                    </div>

                    <p className={`mt-4 text-sm leading-6 ${isActive ? 'text-[#f3efe6]/70' : 'text-[#071a27]/65'}`}>
                      {card.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className={`rounded-full border px-3 py-1 mono text-[9px] uppercase tracking-[.14em] ${difficultyTone(card.difficulty)}`}>{card.difficulty}</span>
                      <span className={`rounded-full border px-3 py-1 mono text-[9px] uppercase tracking-[.14em] ${isActive ? 'border-[#f3efe6]/25 text-[#f3efe6]/75' : 'border-[#071a27]/18 text-[#071a27]/55'}`}>📚 {card.lessons}</span>
                      <span className={`rounded-full border px-3 py-1 mono text-[9px] uppercase tracking-[.14em] ${isActive ? 'border-[#f3efe6]/25 text-[#f3efe6]/75' : 'border-[#071a27]/18 text-[#071a27]/55'}`}>⏱ {card.estimatedTime}</span>
                    </div>

                    <div className="mt-5">
                      <div className={`h-2 w-full overflow-hidden rounded-full ${isActive ? 'bg-[#f3efe6]/15' : 'bg-[#071a27]/10'}`}>
                        <div className="h-full rounded-full bg-[#c9f36b]" style={{ width: `${card.progress}%` }} />
                      </div>
                    </div>

                    <div className={`mt-5 inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[.16em] ${isActive ? 'text-[#c9f36b]' : 'text-[#071a27]/70'}`}>
                      Start learning <ArrowUpRight size={13} />
                    </div>
                  </motion.button>
                </Reveal>
              );
            })}

            <Reveal delay={0.12}>
              <div className="rounded-[18px] border border-dashed border-[#071a27]/20 bg-[#fffdf8] p-6">
                <div className="flex items-center gap-2 mono text-[9px] uppercase tracking-[.17em] text-[#071a27]/55"><Zap size={12} className="text-[#ff7251]" /> Optional follow-up series</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <a href="#contact" className="group flex items-center justify-between rounded-xl border border-[#071a27]/14 bg-white px-4 py-3 text-sm font-bold text-[#071a27]/82 transition-all hover:-translate-y-0.5 hover:border-[#071a27]/28" data-testid="link-followup-lld">Low-level design <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
                  <a href="#contact" className="group flex items-center justify-between rounded-xl border border-[#071a27]/14 bg-white px-4 py-3 text-sm font-bold text-[#071a27]/82 transition-all hover:-translate-y-0.5 hover:border-[#071a27]/28" data-testid="link-followup-production">Production engineering <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="min-w-0">
            <div className="sticky top-6 overflow-hidden rounded-[20px] border border-[#071a27]/12 bg-[#fffdf8] p-6 shadow-[0_12px_36px_rgba(7,26,39,0.08)] sm:p-8">
              <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full border-[20px] border-[#c9f36b]/20" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="mono mb-3 text-[10px] uppercase tracking-[.18em] text-[#ff7251]">Phase {phase.index}</div>
                  <h3 data-testid={`text-selected-phase-${phase.id}`} className="display text-4xl leading-[.95] text-[#071a27] sm:text-5xl">{selectedCard.icon} {phase.name}</h3>
                </div>
                <span className="mono rounded-full border border-[#071a27]/14 px-3 py-1 text-[10px] text-[#071a27]/55">{phase.range}</span>
              </div>

              <p className="relative mt-5 max-w-[540px] text-sm leading-7 text-[#071a27]/66">{selectedCard.description}</p>

              <div className="relative mt-6 flex flex-wrap gap-2">
                <span className={`rounded-full border px-3 py-1 mono text-[9px] uppercase tracking-[.14em] ${difficultyTone(selectedCard.difficulty)}`}>{selectedCard.difficulty}</span>
                <span className="rounded-full border border-[#071a27]/16 px-3 py-1 mono text-[9px] uppercase tracking-[.14em] text-[#071a27]/58">📚 {selectedCard.lessons}</span>
                <span className="rounded-full border border-[#071a27]/16 px-3 py-1 mono text-[9px] uppercase tracking-[.14em] text-[#071a27]/58">⏱ {selectedCard.estimatedTime}</span>
              </div>

              <div className="relative mt-8 border-t border-[#071a27]/12 pt-6">
                {phase.id === 'foundations' ? (
                  <a href="/content" className="inline-flex items-center gap-2 rounded-xl border border-[#071a27]/30 bg-[#071a27] px-4 py-3 mono text-[10px] uppercase tracking-[.14em] text-[#f3efe6] transition-colors hover:bg-[#0e2738]" data-testid="link-phase-01-explanation">
                    Open Phase 01 explanation <ArrowUpRight size={13} />
                  </a>
                ) : phase.id === 'building-blocks' ? (
                  <a href="/content/core-building-blocks" className="inline-flex items-center gap-2 rounded-xl border border-[#071a27]/30 bg-[#071a27] px-4 py-3 mono text-[10px] uppercase tracking-[.14em] text-[#f3efe6] transition-colors hover:bg-[#0e2738]" data-testid="link-phase-02-explanation">
                    Open Phase 02 explanation <ArrowUpRight size={13} />
                  </a>
                ) : phase.id === 'distributed' ? (
                  <a href="/content/consistent-hashing" className="inline-flex items-center gap-2 rounded-xl border border-[#071a27]/30 bg-[#071a27] px-4 py-3 mono text-[10px] uppercase tracking-[.14em] text-[#f3efe6] transition-colors hover:bg-[#0e2738]" data-testid="link-phase-03-explanation">
                    Open Phase 03 explanation <ArrowUpRight size={13} />
                  </a>
                ) : (
                  <a href="/content" className="inline-flex items-center gap-2 rounded-xl border border-[#071a27]/30 bg-[#071a27] px-4 py-3 mono text-[10px] uppercase tracking-[.14em] text-[#f3efe6] transition-colors hover:bg-[#0e2738]" data-testid="link-phase-content">
                    Open content page <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Topics() {
  return (
    <section id="topics" className="bg-[#c9f36b] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto max-w-[1380px]">
        <Reveal><div className="mono mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[.2em] text-[#071a27]/65"><span className="h-px w-8 bg-[#071a27]/55" />02 / Featured topics</div><div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><h2 className="display max-w-[800px] text-5xl leading-[.91] sm:text-7xl">The ideas that change<br />how you <span className="text-[#ff7251]">draw a box.</span></h2><p className="max-w-[275px] text-sm leading-6 text-[#071a27]/65">Not a glossary. A set of lenses for making better calls with incomplete information.</p></div></Reveal>
        <div className="mt-14 grid gap-px bg-[#071a27]/20 md:grid-cols-3">
          {topics.map((topic, index) => {
            const Icon = topic.icon;
            return <Reveal key={topic.label} delay={index * .1} className="bg-[#c9f36b]"><a href="#roadmap" className="group block min-h-[275px] p-6 transition-colors hover:bg-[#071a27] hover:text-[#f3efe6] sm:p-8" data-testid={`link-topic-${index}`}>
              <div className="flex items-start justify-between"><Icon size={22} strokeWidth={1.4} /><ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
              <div className="mt-20"><div className="mono text-[9px] uppercase tracking-[.16em] opacity-55">{topic.label}</div><h3 className="display mt-3 text-3xl leading-none">{topic.title}</h3><p className="mt-4 max-w-[280px] text-sm leading-6 opacity-65">{topic.body}</p></div>
            </a></Reveal>;
          })}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-[#f3efe6] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto grid max-w-[1380px] gap-16 lg:grid-cols-[.8fr_1.2fr] lg:gap-28">
        <Reveal>
          <div className="mono mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[.2em] text-[#ff7251]"><span className="h-px w-8 bg-[#ff7251]" />03 / About the academy</div>
          <div className="sticky top-10"><h2 className="display text-5xl leading-[.92] sm:text-7xl">A better way to<br /><span className="text-[#ff7251]">think in systems.</span></h2><div className="mt-10 border-l-2 border-[#c9f36b] pl-5 text-sm leading-6 text-[#071a27]/62">The best engineers are not the ones who memorize the most patterns. They are the ones who can make a sound decision when the requirements move.</div></div>
        </Reveal>
        <div className="space-y-12">
          <Reveal delay={.1}><p className="max-w-[640px] text-xl leading-8 text-[#071a27]/78 sm:text-2xl">System Design Academy is a focused curriculum for backend engineers who want to move from knowing the parts to seeing the whole.</p></Reveal>
          <Reveal delay={.18}><div className="section-rule" /><div className="mt-8 grid gap-8 sm:grid-cols-2"><div><div className="mono text-[10px] uppercase tracking-[.16em] text-[#071a27]/45">01 / Visual first</div><p className="mt-3 text-sm leading-6 text-[#071a27]/65">Every lesson starts with a picture: a flow, a boundary, a failure, or a sequence you can hold in your head.</p></div><div><div className="mono text-[10px] uppercase tracking-[.16em] text-[#071a27]/45">02 / Constraint led</div><p className="mt-3 text-sm leading-6 text-[#071a27]/65">You will design against traffic, latency, cost, and failure—not against a fantasy requirements document.</p></div></div></Reveal>
          <Reveal delay={.25}><div className="relative overflow-hidden bg-[#071a27] p-7 text-[#f3efe6] sm:p-10"><div className="absolute right-8 top-8 opacity-30"><Code2 size={74} strokeWidth={.7} /></div><div className="relative mono text-[10px] uppercase tracking-[.18em] text-[#c9f36b]">The working principle</div><blockquote className="relative mt-10 max-w-[500px] font-serif text-2xl leading-8 text-[#f3efe6]/90 sm:text-3xl">“If you cannot explain where the system bends, you do not yet understand its shape.”</blockquote><div className="relative mt-8 mono text-[9px] uppercase tracking-[.15em] text-[#f3efe6]/42">— Curriculum note / 2025</div></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function Resources() {
  return (
    <section id="resources" className="bg-[#e9e1d3] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto max-w-[1380px]">
        <Reveal><div className="flex flex-col justify-between gap-8 border-b border-[#071a27]/15 pb-10 lg:flex-row lg:items-end"><div><div className="mono mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[.2em] text-[#ff7251]"><span className="h-px w-8 bg-[#ff7251]" />04 / Resources</div><h2 className="display text-5xl leading-[.93] sm:text-7xl">Tools for the<br /><span className="text-[#ff7251]">next whiteboard.</span></h2></div><p className="max-w-[285px] text-sm leading-6 text-[#071a27]/60">Free instruments to help you practice the kind of thinking the roadmap asks for.</p></div></Reveal>
        <div className="mt-10 divide-y divide-[#071a27]/15 border-b border-[#071a27]/15">
          {resources.map((resource, index) => <Reveal key={resource.title} delay={index * .08}><a href="#contact" className="resource-link group flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between" data-testid={`link-resource-${index}`}><div className="flex items-start gap-6"><span className="mono mt-1 text-[10px] text-[#071a27]/40">0{index + 1}</span><div><div className="mono text-[9px] uppercase tracking-[.17em] text-[#ff7251]">{resource.type}</div><h3 className="display mt-2 text-3xl">{resource.title}</h3><p className="mt-2 max-w-[500px] text-sm leading-6 text-[#071a27]/55">{resource.detail}</p></div></div><span className="flex shrink-0 items-center gap-2 self-end border-b border-[#071a27]/30 pb-1 mono text-[9px] uppercase tracking-[.15em] sm:self-center">{resource.action}<ExternalLink size={13} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span></a></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) setSubmitted(true);
  };
  return (
    <section id="contact" className="bg-[#071a27] px-5 py-24 text-[#f3efe6] sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto grid max-w-[1380px] gap-16 lg:grid-cols-[1fr_.75fr] lg:gap-28">
        <Reveal><div className="mono mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[.2em] text-[#c9f36b]"><span className="h-px w-8 bg-[#c9f36b]" />05 / Contact</div><h2 className="display max-w-[680px] text-6xl leading-[.87] sm:text-8xl">Build a system<br /><span className="text-[#c9f36b]">worth shipping.</span></h2><p className="mt-8 max-w-[430px] text-sm leading-6 text-[#d5e0dd]/60">Get the next field note, roadmap updates, and a practical prompt for your next design session. No noise. Unsubscribe whenever.</p><div className="mt-10 flex items-center gap-4 text-[#d5e0dd]/45"><Radio size={17} className="text-[#ff7251]" /><span className="mono text-[9px] uppercase tracking-[.15em]">A small signal for ambitious engineers</span></div></Reveal>
        <Reveal delay={.15}><form onSubmit={submit} className="border-t border-[#f3efe6]/20 pt-5" data-testid="form-contact">{submitted ? <div className="flex min-h-[230px] flex-col justify-center"><div className="grid h-11 w-11 place-items-center bg-[#c9f36b] text-[#071a27]"><Check size={21} /></div><h3 className="display mt-6 text-4xl">You are on the list.</h3><p className="mt-3 text-sm text-[#d5e0dd]/60">Watch your inbox for the next field note.</p><button type="button" onClick={() => { setSubmitted(false); setEmail(''); }} className="mt-8 w-fit mono text-[9px] uppercase tracking-[.15em] text-[#c9f36b] underline underline-offset-4" data-testid="button-contact-reset">Use another email</button></div> : <><label htmlFor="email" className="mono text-[10px] uppercase tracking-[.16em] text-[#d5e0dd]/55">Your email</label><div className="mt-4 flex border-b border-[#f3efe6]/30 pb-3 focus-within:border-[#c9f36b]"><Mail size={17} className="mr-3 mt-1 text-[#c9f36b]" /><input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="engineer@company.com" className="min-w-0 flex-1 bg-transparent text-[15px] text-[#f3efe6] placeholder:text-[#d5e0dd]/35 focus:outline-none" data-testid="input-contact-email" /><button type="submit" className="ml-3 flex items-center gap-2 mono text-[9px] uppercase tracking-[.14em] text-[#c9f36b] transition-transform hover:translate-x-1" data-testid="button-contact-submit">Join <Send size={14} /></button></div><p className="mt-4 mono text-[9px] leading-5 tracking-[.04em] text-[#d5e0dd]/35">By joining, you agree to receive occasional notes from SDA.</p><div className="mt-16 grid grid-cols-2 gap-5 border-t border-[#f3efe6]/15 pt-5"><div><div className="mono text-[9px] uppercase tracking-[.15em] text-[#d5e0dd]/40">Curriculum</div><div className="mt-2 text-sm">80 lessons / 7 phases</div></div><div><div className="mono text-[9px] uppercase tracking-[.15em] text-[#d5e0dd]/40">Format</div><div className="mt-2 text-sm">Visual / practical / direct</div></div></div></>}</form></Reveal>
      </div>
      <div className="mx-auto mt-24 flex max-w-[1380px] flex-col justify-between gap-5 border-t border-[#f3efe6]/15 pt-5 sm:flex-row sm:items-center"><Brand /><div className="flex items-center gap-5 mono text-[9px] uppercase tracking-[.15em] text-[#d5e0dd]/40"><a href="#top" className="hover:text-[#c9f36b]" data-testid="link-footer-top">Back to top</a><a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#c9f36b]" data-testid="link-footer-github"><Github size={14} /> Notes on GitHub</a></div></div>
    </section>
  );
}

function Home() {
  useEffect(() => {
    document.title = 'System Design Academy — Master Backend Engineering';
  }, []);
  return <div className="min-h-[100dvh]"><Navigation /><HomeIntroduction /><Roadmap /><Topics /><About /><Resources /><Contact /></div>;
}

function ContentPage() {
  useEffect(() => {
    document.title = 'Lesson 01 — What is System Design?';
  }, []);

  return <div className="min-h-[100dvh]"><Navigation isContentPage /><LessonOneContent /></div>;
}

function PartTwoPage() {
  useEffect(() => {
    document.title = 'Part II — Core Building Blocks (09-24)';
  }, []);

  return <div className="min-h-[100dvh]"><Navigation isContentPage /><PartTwoContent /></div>;
}

function LessonTwentyFivePage() {
  useEffect(() => {
    document.title = 'Lesson 25 — Consistent Hashing';
  }, []);

  return <div className="min-h-[100dvh]"><Navigation isContentPage /><LessonTwentyFiveContent /></div>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/content" component={ContentPage} />
        <Route path="/content/core-building-blocks" component={PartTwoPage} />
        <Route path="/content/consistent-hashing" component={LessonTwentyFivePage} />
        <Route path="/roadmaps/kafka"><Navigation isContentPage /><InterviewRoadmap key="kafka" guide={kafkaGuide} /></Route>
        <Route path="/roadmaps/redis"><Navigation isContentPage /><InterviewRoadmap key="redis" guide={redisGuide} /></Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;