import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { sound } from '../utils/audio';

export default function Learn() {
  const [activeAccordion, setActiveAccordion] = useState('deadlock');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const toggleAccordion = (id) => {
    sound.playClick();
    setActiveAccordion(prev => (prev === id ? null : id));
  };

  const handleSelectQuiz = (qIdx, optIdx) => {
    sound.playClick();
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const quizQuestions = [
    {
      question: "Which of the following is TRUE regarding an 'Unsafe State' in Banker's Algorithm?",
      options: [
        "An unsafe state is always a deadlocked state.",
        "An unsafe state is NOT necessarily deadlocked, but deadlock is possible if processes request maximum claims.",
        "An unsafe state means all processes have crashed.",
        "An unsafe state can never transition back to a safe state.",
      ],
      correct: 1,
      explanation: "An unsafe state is not synonymous with deadlock. It simply means the OS cannot guarantee deadlock avoidance if all processes suddenly claim their maximum demands.",
    },
    {
      question: "What is the computational time complexity of the Banker's Safety Algorithm?",
      options: [
        "O(1)",
        "O(n + m)",
        "O(m × n²), where n = processes, m = resource types",
        "O(n!)",
      ],
      correct: 2,
      explanation: "In the worst case, each of the n processes may be examined up to n times, and each check requires m comparisons, yielding O(m × n²).",
    },
    {
      question: "What condition triggers CHECK 1 in the Resource Request Algorithm?",
      options: [
        "Request[i] > Available",
        "Request[i] > Need[i] (Process exceeded its declared maximum claim)",
        "Available == 0",
        "Finish[i] == true",
      ],
      correct: 1,
      explanation: "CHECK 1 ensures Request[i] ≤ Need[i]. If a process requests more than its declared maximum claim, an error is generated.",
    },
    {
      question: "Which of the following is a major practical limitation of the Banker's Algorithm?",
      options: [
        "It cannot handle more than one process.",
        "Processes must declare their maximum resource claims in advance.",
        "It only works on Windows OS.",
        "It requires infinite memory.",
      ],
      correct: 1,
      explanation: "In modern general-purpose operating systems, processes rarely know their exact peak resource demands before starting execution.",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-br from-blue-950/50 via-slate-900/80 to-purple-950/40 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-glass">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
            OS Theory & Pedagogy
          </span>
          <span className="text-xs text-slate-400">• Comprehensive Operating Systems Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Mastering the Banker's Algorithm & Deadlock Avoidance
        </h1>
        <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-3xl">
          An in-depth, mathematically formal explanation of Edsger Dijkstra's pioneering algorithm for resource allocation and deadlock avoidance in multiprogramming systems.
        </p>
      </div>

      {/* Core Topics Accordion */}
      <div className="space-y-4">
        {/* Section 1: Operating System & Deadlocks */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl overflow-hidden">
          <button
            onClick={() => toggleAccordion('deadlock')}
            className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">1. What is an Operating System & What is Deadlock?</h3>
                <p className="text-xs text-slate-400 mt-0.5">Resource management and the 4 Coffman conditions</p>
              </div>
            </div>
            {activeAccordion === 'deadlock' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {activeAccordion === 'deadlock' && (
            <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                An <strong>Operating System (OS)</strong> manages computer hardware and system resources (CPU cycles, RAM, disk channels, I/O ports) across competing software processes. When multiple concurrent processes compete for a finite set of resources, a <strong>deadlock</strong> can occur.
              </p>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  The Four Coffman Conditions (All must hold simultaneously for deadlock):
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                  <li><strong>Mutual Exclusion:</strong> At least one resource must be held in a non-shareable mode.</li>
                  <li><strong>Hold and Wait:</strong> A process must be holding at least one resource and waiting to acquire additional resources held by other processes.</li>
                  <li><strong>No Preemption:</strong> Resources cannot be forcibly preempted; they can only be released voluntarily by the holding process.</li>
                  <li><strong>Circular Wait:</strong> A closed chain of processes exists: <span className="font-mono text-cyan-300">P0 → P1 → ... → Pn → P0</span>, where each process waits for a resource held by the next.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Banker's Analogy & Algorithm Overview */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl overflow-hidden">
          <button
            onClick={() => toggleAccordion('banker')}
            className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">2. Dijkstra's Banker's Algorithm Analogy</h3>
                <p className="text-xs text-slate-400 mt-0.5">Why it's named after a small town banker</p>
              </div>
            </div>
            {activeAccordion === 'banker' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {activeAccordion === 'banker' && (
            <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                In 1965, computer scientist <strong>Edsger W. Dijkstra</strong> conceived this algorithm for the THE multiprogramming system. He visualized an analogy of a small-town banker dealing with a group of clients to whom credit lines have been granted.
              </p>
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2 text-xs">
                <p>
                  • A customer declares their <strong>Maximum Credit Limit</strong> in advance.<br/>
                  • The banker will never allocate cash if the remaining available reserves cannot satisfy at least one customer's remaining credit to completion.<br/>
                  • When a customer finishes their project, they return all borrowed money, ensuring the next customer can finish.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Safe vs Unsafe State Distinction */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl overflow-hidden">
          <button
            onClick={() => toggleAccordion('states')}
            className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">3. Safe State vs Unsafe State (Critical Distinction)</h3>
                <p className="text-xs text-slate-400 mt-0.5">An unsafe state is NOT necessarily a deadlock!</p>
              </div>
            </div>
            {activeAccordion === 'states' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {activeAccordion === 'states' && (
            <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 text-sm text-slate-300 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Safe State</span>
                  <p className="text-xs text-slate-300">
                    A state is safe if there exists a <strong>Safe Sequence</strong> &lt; P1, P2, ..., Pn &gt; such that for each Pi, the resources Pi can still request can be satisfied by current Available plus resources held by all Pj (with j &lt; i).
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Unsafe State</span>
                  <p className="text-xs text-slate-300">
                    An unsafe state is <strong>NOT</strong> necessarily a deadlock! However, the OS can no longer prevent processes from deadlocking if every process chooses to request its maximum demand simultaneously.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Mathematical Formulas & Algorithm Steps */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl overflow-hidden">
          <button
            onClick={() => toggleAccordion('math')}
            className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">4. Mathematical Matrices & Data Structures</h3>
                <p className="text-xs text-slate-400 mt-0.5">Allocation, Max, Available, Need vectors</p>
              </div>
            </div>
            {activeAccordion === 'math' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {activeAccordion === 'math' && (
            <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 text-sm text-slate-300 leading-relaxed font-sans">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 font-mono text-xs space-y-2 text-cyan-300">
                <p>• Available[m]: Available[j] = k means k instances of resource Rj are free.</p>
                <p>• Max[n][m]: Max[i][j] = k means process Pi may request at most k instances of Rj.</p>
                <p>• Allocation[n][m]: Allocation[i][j] = k means Pi is currently allocated k instances of Rj.</p>
                <p className="text-emerald-300 font-bold">• Need[i][j] = Max[i][j] - Allocation[i][j]</p>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Advantages and Limitations */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl overflow-hidden">
          <button
            onClick={() => toggleAccordion('pros-cons')}
            className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">5. Advantages, Trade-offs & Real-World Limitations</h3>
                <p className="text-xs text-slate-400 mt-0.5">Why modern general-purpose kernels use alternative strategies</p>
              </div>
            </div>
            {activeAccordion === 'pros-cons' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {activeAccordion === 'pros-cons' && (
            <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 text-sm text-slate-300 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Advantages</span>
                  <ul className="list-disc list-inside text-xs space-y-1 text-slate-300">
                    <li>Provides mathematical guarantee against deadlock.</li>
                    <li>Allows concurrent resource sharing without preemption.</li>
                    <li>Less restrictive than static deadlock prevention techniques.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Limitations</span>
                  <ul className="list-disc list-inside text-xs space-y-1 text-slate-300">
                    <li>Requires processes to declare their maximum demand in advance (rarely feasible in desktop/server OS).</li>
                    <li>The number of processes and resources must remain fixed during computation.</li>
                    <li>High computational overhead: O(m × n²) executed on every single resource request.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Knowledge Quiz Section */}
      <GlassCard
        title="Interactive Deadlock & Banker's Quiz"
        subtitle="Test your comprehension with immediate feedback"
        icon={HelpCircle}
        glowColor="cyan"
      >
        <div className="space-y-6 mt-4">
          {quizQuestions.map((q, qIdx) => {
            const selectedOpt = quizAnswers[qIdx];
            const isCorrect = selectedOpt === q.correct;

            return (
              <div key={qIdx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <h4 className="text-sm font-semibold text-white">
                  Q{qIdx + 1}: {q.question}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = selectedOpt === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectQuiz(qIdx, optIdx)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          isOptionSelected
                            ? 'bg-blue-600/30 border-blue-400 text-white font-medium shadow-glass-glow-blue'
                            : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {selectedOpt !== undefined && (
                  <div className={`p-3 rounded-xl text-xs font-medium border ${
                    isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}>
                    {isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
