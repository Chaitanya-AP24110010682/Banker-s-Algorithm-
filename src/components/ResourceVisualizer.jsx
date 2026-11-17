import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Cpu,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { RESOURCE_METADATA } from '../data/initialData';

export default function ResourceVisualizer({
  allocation = [],
  need = [],
  available = [],
  processNames = [],
  resourceNames = [],
  currentStep = null,
  safetyState = {},
}) {
  const currentWork = currentStep?.work || currentStep?.workAfter || available;
  const currentProcessIdx = currentStep?.processIndex ?? null;
  const finish = currentStep?.finish || safetyState?.finish || [];

  // Determine process execution state
  const getProcessState = (pIdx) => {
    const isFinished = finish[pIdx];
    const isCurrent = currentProcessIdx === pIdx;

    if (isFinished) return 'COMPLETED';
    if (isCurrent) {
      if (currentStep?.type === 'PROCESS_SATISFIED') return 'EXECUTING';
      if (currentStep?.type === 'PROCESS_BLOCKED') return 'BLOCKED';
      return 'ELIGIBLE';
    }
    return 'WAITING';
  };

  const stateStyles = {
    COMPLETED: {
      bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-glass-glow-green',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
      label: 'Completed',
    },
    EXECUTING: {
      bg: 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200 shadow-glass-glow-cyan ring-2 ring-cyan-400/40',
      badge: 'bg-cyan-500/30 text-cyan-200 border-cyan-400/50',
      icon: <Flame className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />,
      label: 'Executing & Releasing',
    },
    BLOCKED: {
      bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-glass-glow-red',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
      label: 'Blocked (Need > Work)',
    },
    ELIGIBLE: {
      bg: 'bg-blue-500/15 border-blue-500/40 text-blue-300 shadow-glass-glow-blue',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" />,
      label: 'Eligible',
    },
    WAITING: {
      bg: 'bg-slate-900/60 border-white/10 text-slate-300',
      badge: 'bg-white/5 text-slate-400 border-white/10',
      icon: <Clock className="w-3.5 h-3.5 text-slate-500" />,
      label: 'Waiting',
    },
  };

  return (
    <div className="relative w-full rounded-3xl p-6 bg-slate-950/70 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Interactive Central Bank Architecture</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time visualization of resource distribution, holding locks, and release streams
          </p>
        </div>

        {/* Dynamic state legend */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium">
          {['Waiting', 'Executing', 'Completed', 'Blocked'].map((key) => {
            const upper = key.toUpperCase();
            const s = stateStyles[upper] || stateStyles.WAITING;
            return (
              <span key={key} className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${s.badge}`}>
                {s.icon}
                <span>{key}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Central Bank / Resource Pool Node */}
      <div className="relative z-10 my-8 flex justify-center">
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative max-w-xl w-full p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-blue-950/40 border border-cyan-500/30 shadow-glass-glow-cyan backdrop-blur-2xl text-center"
        >
          {/* Top light reflection */}
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-extrabold uppercase tracking-widest text-cyan-300">
                Central Bank (Available / Work Pool)
              </h5>
              <p className="text-[11px] text-slate-400">Total unallocated resources available for dispatch</p>
            </div>
          </div>

          {/* Available resource counters */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
            {resourceNames.map((res, j) => {
              const meta = RESOURCE_METADATA[res] || { color: '#38bdf8', name: res };
              const val = currentWork[j] ?? 0;
              return (
                <div
                  key={j}
                  className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {res} ({meta.name?.split(' ')[0] || res})
                  </span>
                  <span className="text-xl font-extrabold font-mono mt-1" style={{ color: meta.color }}>
                    {val}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Process Nodes Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allocation.map((allocRow, i) => {
          const pName = processNames[i] || `P${i}`;
          const pNeed = need[i] || [];
          const state = getProcessState(i);
          const style = stateStyles[state];
          const isCurrentExecuting = state === 'EXECUTING';

          return (
            <motion.div
              key={i}
              layout
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`
                relative rounded-3xl p-5 border transition-all duration-300 backdrop-blur-2xl
                ${style.bg}
              `}
            >
              {/* Process Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-mono font-bold text-xs text-white">
                    {pName}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">Process #{i}</span>
                </div>

                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${style.badge}`}>
                  {style.icon}
                  <span>{style.label}</span>
                </span>
              </div>

              {/* Resource Vectors inside process */}
              <div className="space-y-2 text-xs">
                {/* Allocation */}
                <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                    <ArrowDownLeft className="w-3.5 h-3.5 text-blue-400" />
                    Allocated:
                  </span>
                  <div className="flex items-center gap-2 font-mono font-bold text-blue-300">
                    {allocRow.map((v, j) => (
                      <span key={j} className="px-1.5 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        {resourceNames[j]}:{v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Remaining Need */}
                <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                    Remaining Need:
                  </span>
                  <div className="flex items-center gap-2 font-mono font-bold text-cyan-300">
                    {pNeed.map((v, j) => (
                      <span key={j} className="px-1.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        {resourceNames[j]}:{v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Particle Animation when Executing */}
              {isCurrentExecuting && (
                <div className="mt-3 pt-2 border-t border-cyan-500/30 flex items-center justify-center gap-2 text-[11px] font-mono text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Releasing [{allocRow.join(', ')}] → Bank</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
