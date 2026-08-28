import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  CirclePlay,
  Code2,
  ExternalLink,
  Github,
  Layers3,
  Mail,
  Menu,
  Network,
  Radio,
  Send,
  Terminal,
  X,
  Zap,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
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

function Navigation() {
  const [open, setOpen] = useState(false);
  const items = [['Roadmap', 'roadmap'], ['Topics', 'topics'], ['About', 'about'], ['Resources', 'resources']];
  return (
    <header className="absolute left-0 right-0 top-0 z-40 border-b border-white/10">
      <div className="mx-auto flex max-w-[1380px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Brand />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {items.map(([label, id]) => <a key={id} href={`#${id}`} className="mono text-[10px] uppercase tracking-[.16em] text-[#d5e0dd]/75 transition-colors hover:text-[#c9f36b]" data-testid={`link-nav-${id}`}>{label}</a>)}
        </nav>
        <a href="#contact" className="hidden items-center gap-2 border border-[#c9f36b]/50 px-4 py-2.5 mono text-[10px] uppercase tracking-[.15em] text-[#c9f36b] transition-colors hover:bg-[#c9f36b] hover:text-[#071a27] sm:flex" data-testid="link-nav-start">Start the roadmap <ArrowUpRight size={13} /></a>
        <button type="button" className="text-[#f3efe6] md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open && <div className="border-t border-white/10 bg-[#071a27] px-5 py-4 md:hidden">
        {items.map(([label, id]) => <a onClick={() => setOpen(false)} key={id} href={`#${id}`} className="block border-b border-white/10 py-3 mono text-[10px] uppercase tracking-[.16em] text-[#d5e0dd]/75" data-testid={`link-mobile-nav-${id}`}>{label}</a>)}
        <a onClick={() => setOpen(false)} href="#contact" className="mt-3 block bg-[#c9f36b] px-4 py-3 text-center mono text-[10px] uppercase tracking-[.15em] text-[#071a27]" data-testid="link-mobile-start">Start the roadmap</a>
      </div>}
    </header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0.08]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.06]);
  const y = useTransform(scrollY, [0, 500], [0, 80]);
  return (
    <section id="top" className="relative min-h-[100dvh] overflow-hidden bg-[#071a27] text-[#f3efe6]">
      <motion.div className="hero-video-frame absolute inset-0" style={{ opacity, scale, y }} aria-label="Video-ready hero background placeholder">
        <div className="absolute inset-0 opacity-70">
          <svg className="h-full w-full" viewBox="0 0 1400 850" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-40 694 C180 610 210 540 402 565 S725 730 900 540 1110 180 1450 236" fill="none" stroke="#c9f36b" strokeOpacity=".32" strokeWidth="1" className="signal-line" />
            <path d="M-20 754 C170 704 315 530 512 580 S790 680 1000 436 1240 256 1420 300" fill="none" stroke="#a8d8e9" strokeOpacity=".18" strokeWidth="1" className="signal-line" />
            <path d="M-30 410 C180 300 308 415 488 332 S782 104 992 226 1230 386 1450 94" fill="none" stroke="#ff7251" strokeOpacity=".2" strokeWidth="1" className="signal-line" />
            <circle cx="902" cy="539" r="5" fill="#c9f36b" /><circle cx="902" cy="539" r="17" fill="none" stroke="#c9f36b" strokeOpacity=".35" />
            <circle cx="514" cy="579" r="4" fill="#a8d8e9" /><circle cx="514" cy="579" r="14" fill="none" stroke="#a8d8e9" strokeOpacity=".3" />
          </svg>
        </div>
      </motion.div>
      <Navigation />
      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1380px] flex-col justify-end px-5 pb-12 pt-32 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="mb-auto flex items-center gap-3 pt-32 sm:pt-36">
          <span className="h-px w-10 bg-[#c9f36b]" />
          <span className="mono text-[10px] uppercase tracking-[.2em] text-[#c9f36b]">An 80-lesson instrument for serious builders</span>
        </div>
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_330px]">
          <div>
            <motion.h1 data-testid="text-hero-headline" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .15 }} className="display max-w-[850px] text-[clamp(4.2rem,11vw,10.4rem)] font-medium leading-[.83]">
              Master Backend<br /><span className="text-[#c9f36b]">Engineering</span>
            </motion.h1>
            <motion.p data-testid="text-hero-subheadline" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .36 }} className="mt-8 max-w-[590px] text-[15px] leading-7 text-[#d5e0dd]/75 sm:text-[17px]">
              Learn System Design through visual roadmaps, interactive diagrams, production-ready architecture, and real-world case studies.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }} className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#roadmap" className="group flex items-center gap-3 bg-[#c9f36b] px-5 py-3.5 mono text-[10px] font-bold uppercase tracking-[.14em] text-[#071a27] transition-transform hover:-translate-y-1" data-testid="link-hero-roadmap">
                Explore the roadmap <ArrowDown size={15} className="transition-transform group-hover:translate-y-1" />
              </a>
              <a href="#about" className="flex items-center gap-2 px-2 py-3 mono text-[10px] uppercase tracking-[.14em] text-[#d5e0dd]/70 hover:text-[#c9f36b]" data-testid="link-hero-about">
                Why this exists <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .6 }} className="border-l border-[#d5e0dd]/20 pl-5">
            <div className="mb-7 flex items-center gap-2 mono text-[9px] uppercase tracking-[.18em] text-[#d5e0dd]/50"><CirclePlay size={12} className="text-[#c9f36b]" /> Video-ready layer / coming soon</div>
            <div className="flex items-end gap-2"><span className="display text-5xl text-[#f3efe6]">80</span><span className="mono mb-1 text-[10px] uppercase tracking-[.14em] text-[#d5e0dd]/55">lessons<br />to fluency</span></div>
            <div className="mt-5 h-px w-full bg-[#d5e0dd]/20"><div className="h-px w-[12%] bg-[#c9f36b]" /></div>
            <div className="mt-3 flex justify-between mono text-[9px] uppercase tracking-[.12em] text-[#d5e0dd]/45"><span>Foundations</span><span>Production</span></div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-5 right-5 z-20 hidden items-center gap-3 lg:flex"><span className="mono text-[9px] uppercase tracking-[.18em] text-[#d5e0dd]/40">Scroll to begin</span><div className="h-8 w-px bg-[#c9f36b]/60" /></div>
    </section>
  );
}

function Roadmap() {
  const [selected, setSelected] = useState('foundations');
  const phase = phases.find((item) => item.id === selected) ?? phases[0];
  const [expanded, setExpanded] = useState(false);
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
        <div className="mt-10 grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div className="space-y-2">
            {phases.map((item) => (
              <button key={item.id} type="button" onClick={() => { setSelected(item.id); setExpanded(false); }} className={`roadmap-card flex w-full items-center gap-4 border border-[#071a27]/12 p-4 text-left ${selected === item.id ? 'active' : 'bg-[#f3efe6]'}`} data-testid={`button-phase-${item.id}`}>
                <span className="mono w-8 text-[10px] opacity-55">{item.index}</span>
                <span className="flex-1"><span className="block text-[15px] font-bold">{item.name}</span><span className={`muted mt-1 block mono text-[9px] uppercase tracking-[.14em] ${selected === item.id ? 'text-[#f3efe6]/60' : 'text-[#071a27]/45'}`}>{item.range} / {item.lessons.length} lessons</span></span>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {selected === item.id && <ArrowUpRight size={16} className="text-[#c9f36b]" />}
              </button>
            ))}
            <div className="mt-7 border border-dashed border-[#071a27]/20 p-5">
              <div className="flex items-center gap-2 mono text-[9px] uppercase tracking-[.17em] text-[#071a27]/50"><Zap size={12} className="text-[#ff7251]" /> Optional follow-up series</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a href="#contact" className="group flex items-center justify-between text-sm font-bold" data-testid="link-followup-lld">Low-level design <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
                <a href="#contact" className="group flex items-center justify-between text-sm font-bold" data-testid="link-followup-production">Production engineering <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
              </div>
            </div>
          </div>
          <Reveal delay={.1} className="min-w-0">
            <div className="relative overflow-hidden bg-[#071a27] p-6 text-[#f3efe6] sm:p-8">
              <div className="absolute right-0 top-0 h-36 w-36 translate-x-1/3 -translate-y-1/3 rounded-full border-[22px] border-[#c9f36b]/15" />
              <div className="relative flex items-start justify-between gap-5">
                <div><div className="mono mb-3 text-[10px] uppercase tracking-[.18em] text-[#c9f36b]">Phase {phase.index}</div><h3 data-testid={`text-selected-phase-${phase.id}`} className="display text-4xl">{phase.name}</h3></div>
                <span className="mono text-[11px] text-[#f3efe6]/40">{phase.range}</span>
              </div>
              <p className="relative mt-5 max-w-[480px] text-sm leading-6 text-[#f3efe6]/62">{phase.description}</p>
              <div className="relative mt-8 border-t border-[#f3efe6]/15 pt-4">
                <div className="mb-2 flex justify-between mono text-[9px] uppercase tracking-[.14em] text-[#f3efe6]/40"><span>Lesson index</span><span>{phase.lessons.length} units</span></div>
                <div className="divide-y divide-[#f3efe6]/10">
                  {phase.lessons.map((lesson, index) => (
                    <div data-testid={`row-lesson-${phase.id}-${index + 1}`} className={`lesson-row flex items-center gap-4 py-3 ${index > 4 && !expanded ? 'hidden sm:flex' : ''}`} key={lesson}>
                      <span className="mono w-7 text-[10px] text-[#c9f36b]/75">{String(Number(phase.range.slice(0, 2)) + index).padStart(2, '0')}</span>
                      <span className="text-[13px] text-[#f3efe6]/80">{lesson}</span>
                      {index < 3 && <Check size={13} className="ml-auto shrink-0 text-[#c9f36b]" />}
                    </div>
                  ))}
                </div>
                {phase.lessons.length > 5 && <button type="button" onClick={() => setExpanded(!expanded)} className="mt-4 flex items-center gap-2 mono text-[9px] uppercase tracking-[.16em] text-[#c9f36b]" data-testid="button-toggle-lessons">{expanded ? 'Show less' : `Show all ${phase.lessons.length} lessons`}<ChevronDown size={13} className={expanded ? 'rotate-180' : ''} /></button>}
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
  return <div className="noise min-h-[100dvh]"><Hero /><Roadmap /><Topics /><About /><Resources /><Contact /></div>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
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