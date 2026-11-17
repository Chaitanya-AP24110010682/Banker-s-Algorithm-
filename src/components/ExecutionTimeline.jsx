import React, { useRef, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  AlertOctagon,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function ExecutionTimeline({
  steps = [],
  currentStepIndex = 0,
  onSelectStep,
}) {
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentStepIndex]);

  return (
    <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2">
      {steps.map((step, idx) => {
        const isActive = currentStepIndex === idx;
        const isPast = currentStepIndex > idx;

        const isSatisfied = step.type === 'PROCESS_SATISFIED';
        const isBlocked = step.type === 'PROCESS_BLOCKED';
        const isSafeConclusion = step.type === 'CONCLUSION_SAFE';
        const isUnsafeConclusion = step.type === 'CONCLUSION_UNSAFE';
        const isInit = step.type === 'INIT';

        let badgeColor = 'bg-white/10 text-slate-300 border-white/10';
        let icon = <Clock className="w-4 h-4 text-slate-400" />;

        if (isSatisfied) {
          badgeColor = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
          icon = <CheckCircle className="w-4 h-4 text-emerald-400" />;
        } else if (isBlocked) {
          badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
          icon = <Clock className="w-4 h-4 text-amber-400" />;
        } else if (isSafeConclusion) {
          badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
          icon = <CheckCircle className="w-4 h-4 text-emerald-400" />;
        } else if (isUnsafeConclusion) {
          badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
          icon = <AlertOctagon className="w-4 h-4 text-rose-400" />;
        } else if (isInit) {
          icon = <Info className="w-4 h-4 text-cyan-400" />;
        }

        return (
          <div
            key={idx}
            ref={isActive ? activeRef : null}
            onClick={() => onSelectStep && onSelectStep(idx)}
            className={`
              relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left
              ${
                isActive
                  ? 'bg-blue-600/15 border-blue-400/50 shadow-glass-glow-blue ring-1 ring-blue-400/30'
                  : isPast
                  ? 'bg-white/[0.03] border-white/5 opacity-70 hover:opacity-100 hover:bg-white/5'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
              }
            `}
          >
            {/* Step header */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                  isActive ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'bg-white/10 text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-white tracking-tight">{step.title}</span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badgeColor}`}>
                {icon}
                <span>{step.status || step.type}</span>
              </span>
            </div>

            {/* Step description */}
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {step.description}
            </p>

            {/* Vector detail preview for process evaluations */}
            {step.need && step.workBefore && (
              <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                <span className="text-cyan-300 font-semibold">
                  Need: [{step.need.join(', ')}]
                </span>
                <span>{isSatisfied ? '≤' : '>'}</span>
                <span className="text-indigo-300 font-semibold">
                  Work: [{step.workBefore.join(', ')}]
                </span>
                {isSatisfied && step.workAfter && (
                  <>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="text-emerald-300 font-bold">
                      New Work: [{step.workAfter.join(', ')}]
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
