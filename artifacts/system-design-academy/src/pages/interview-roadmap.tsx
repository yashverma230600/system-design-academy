import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowLeft, ArrowRight, ArrowUp, BookOpen, ChevronDown, ChevronsDownUp, ChevronsUpDown, Database, ExternalLink, Moon, Printer, Radio, Search, Sun, X } from 'lucide-react';
import { Link } from 'wouter';
import type { InterviewGuide } from '@/content/interview-roadmaps';
import { interviewLearningAids } from '@/content/interview-roadmap-learning';
import InterviewFlowDiagram from '@/components/interview-flow-diagram';

export default function InterviewRoadmap({ guide }: { guide: InterviewGuide }) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('interview-theme') === 'dark'; } catch { return false; }
  });
  const isKafka = guide.title === 'Kafka';
  const questions = guide.topics.flatMap((topic) => topic.questions);
  const search = query.trim().toLowerCase();
  const visibleTopics = guide.topics.map((topic, index) => ({
    ...topic,
    index,
    questions: topic.questions.filter((question) => {
      const aid = interviewLearningAids[question.id];
      return [question.id, question.title, topic.title, ...question.points, aid.plain, aid.example, ...aid.flow].join(' ').toLowerCase().includes(search);
    }),
  })).filter((topic) => topic.questions.length > 0);
  const visibleCount = visibleTopics.reduce((count, topic) => count + topic.questions.length, 0);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${guide.title} Roadmap | System Design Academy`;
    return () => { document.title = previousTitle; };
  }, [guide.title]);

  function toggleQuestion(id: string) {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    try { localStorage.setItem('interview-theme', next ? 'dark' : 'light'); } catch {}
  }

  return (
    <main className={`interview-guide ${isKafka ? 'guide-kafka' : 'guide-redis'}`} data-theme={dark ? 'dark' : 'light'} id="guide-top">
      <a className="guide-skip" href="#questions">Skip to questions</a>
      <div className="guide-inner">
        <div className="guide-topline">
          <Link href="/" className="guide-back"><ArrowLeft size={16} /> Back to Home</Link>
          <button type="button" className="guide-icon-button" onClick={toggleTheme} aria-label={dark ? 'Light theme' : 'Dark theme'} title={dark ? 'Light theme' : 'Dark theme'}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
        <nav className="guide-tabs" aria-label="Interview roadmaps">
          <Link href="/roadmaps/kafka" aria-current={isKafka ? 'page' : undefined}><Radio size={16} /> Kafka</Link>
          <Link href="/roadmaps/redis" aria-current={!isKafka ? 'page' : undefined}><Database size={16} /> Redis</Link>
        </nav>
        <header className="guide-heading">
          <p className="mono guide-eyebrow">Backend interview preparation</p>
          <h1>{guide.title} Roadmap</h1>
          <p className="guide-description">{guide.description}</p>
          <div className="guide-stats"><span><strong>20</strong> Technical Q&A</span><span><strong>05</strong> Study topics</span><span><strong>04</strong> Talking points per answer</span></div>
        </header>
        <div className="guide-layout">
          <aside className="guide-sidebar">
            <p className="mono guide-eyebrow">Study topics</p>
            <nav aria-label={`${guide.title} study topics`}>
              {guide.topics.map((topic, index) => <a key={topic.title} href={`#topic-${index}`} onClick={() => setQuery('')}><span className="mono">{String(index + 1).padStart(2, '0')}</span><span>{topic.title}</span><ArrowRight size={13} /></a>)}
            </nav>
            <a className="guide-reading" href="#references"><BookOpen size={16} /> Official documentation <ChevronDown size={13} /></a>
          </aside>
          <div className="guide-main" id="questions" tabIndex={-1}>
            <div className="guide-toolbar">
              <div className="guide-search">
                <Search size={18} aria-hidden="true" />
                <input aria-label="Find a question or concept" placeholder={isKafka ? 'Search partitions, exactly-once, K15...' : 'Search eviction, locks, R15...'} type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
                {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search" title="Clear search"><X size={16} /></button>}
              </div>
              <div className="guide-actions">
                <button type="button" className="guide-icon-button" onClick={() => setExpanded(new Set(questions.map((question) => question.id)))} aria-label="Expand answers" title="Expand answers"><ChevronsUpDown size={18} /></button>
                <button type="button" className="guide-icon-button" onClick={() => setExpanded(new Set())} aria-label="Collapse answers" title="Collapse answers"><ChevronsDownUp size={18} /></button>
                <button type="button" className="guide-icon-button" onClick={() => { flushSync(() => setQuery('')); window.print(); }} aria-label="Print guide" title="Print guide"><Printer size={18} /></button>
              </div>
            </div>
            <p className="guide-count mono" role="status" aria-live="polite">{visibleCount} of {questions.length} questions</p>
            <p className="guide-note">{guide.note}</p>
            {visibleCount === 0 && <div className="guide-empty"><Search size={28} /><h2>No matching questions</h2><button type="button" onClick={() => setQuery('')}>Clear search</button></div>}
            {visibleTopics.map((topic) => (
              <section className="guide-topic" key={topic.title} id={`topic-${topic.index}`}>
                <h2><span className="mono">{String(topic.index + 1).padStart(2, '0')}</span>{topic.title}</h2>
                {topic.questions.map((question) => {
                  const open = expanded.has(question.id);
                  return <article key={question.id} className="guide-question" id={question.id}>
                    <h3><button type="button" aria-expanded={open} aria-controls={`answer-${question.id}`} onClick={() => toggleQuestion(question.id)}>
                      <span className="mono guide-question-id">{question.id}</span><span className="guide-question-title">{question.title}</span><ChevronDown size={18} className={open ? 'guide-chevron-open' : ''} />
                    </button></h3>
                    <div className="guide-answer" id={`answer-${question.id}`} hidden={!open}>
                      <section className="guide-learning" aria-label={`Plain-language guide for ${question.id}`}>
                        <p className="mono guide-learning-label">In plain words</p>
                        <p className="guide-learning-plain">{interviewLearningAids[question.id].plain}</p>
                        <p className="guide-learning-example"><strong>Example</strong>{interviewLearningAids[question.id].example}</p>
                        <div className="guide-flow" aria-label={`Flow: ${interviewLearningAids[question.id].flow.join(' then ')}`}>
                          <p className="mono guide-learning-label">How it flows</p>
                          <div className="guide-diagram-overflow"><InterviewFlowDiagram questionId={question.id} steps={interviewLearningAids[question.id].flow} /></div>
                        </div>
                      </section>
                      <ol>{question.points.map((point, index) => <li key={point}><span className="mono" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><p>{point}</p></li>)}</ol>
                    </div>
                  </article>;
                })}
              </section>
            ))}
            <section className="guide-references" id="references">
              <p className="mono guide-eyebrow">Further reading</p>
              <h2>Official documentation</h2>
              <ul>{guide.references.map((reference) => <li key={reference.title}><a href={reference.href} target="_blank" rel="noopener noreferrer">{reference.title}<ExternalLink size={14} /></a></li>)}</ul>
            </section>
          </div>
        </div>
        <footer className="guide-footer"><Link href="/" className="guide-back"><ArrowLeft size={16} /> Back to Home</Link><span>{guide.title} · Interview study guide</span><a href="#guide-top">Back to questions <ArrowUp size={14} /></a></footer>
      </div>
    </main>
  );
}