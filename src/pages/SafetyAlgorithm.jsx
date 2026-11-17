import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import MatrixTable from '../components/MatrixTable';
import SimulationControls from '../components/SimulationControls';
import ExecutionTimeline from '../components/ExecutionTimeline';
import { sound } from '../utils/audio';

export default function SafetyAlgorithm({
  allocation,
  max,
  need,
  available,
  processNames,
  resourceNames,
  safetyState,
  steps,
  currentStepIndex,
  currentStep,
  isPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  nextStep,
  prevStep,
  goToStep,
  resetSimulation,
  togglePlay,
}) {
  const isSafe = safetyState?.isSafe ?? true;
  const safeSequence = safetyState?.safeSequenceNames || [];
  const currentWork = currentStep?.work || currentStep?.workAfter || available;
  const currentFinish = currentStep?.finish || safetyState?.finish || [];
  const currentProcess = currentStep?.processIndex ?? null;

  // Trigger confetti when safety algorithm completes in a safe state
  useEffect(() => {
    if (currentStep?.type === 'CONCLUSION_SAFE') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#007AFF', '#32ADE6', '#34C759', '#AF52DE'],
        });
      } catch (e) {}
    }
  }, [currentStep?.type]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-cyan-400 border border-blue-500/25">
              Algorithm 1
            </span>
            <span className="text-xs text-slate-400">• Formal Deadlock Avoidance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Banker's Safety Algorithm
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Verifies whether a system state allows all processes to satisfy their maximum demand without causing circular deadlock.
          </p>
        </div>

        {/* Live Safe State Pill */}
        <div className={`px-4 py-2.5 rounded-2xl border flex items-center gap-3 backdrop-blur-xl ${
          isSafe
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-glass-glow-green'
            : 'bg-rose-500/15 border-rose-500/30 text-rose-300 shadow-glass-glow-red'
        }`}>
          {isSafe ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
          )}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              {isSafe ? 'System State is Safe' : 'System State is Unsafe'}
            </div>
            <div className="text-[11px] opacity-80 font-mono">
              {isSafe ? `${safeSequence.length} processes safe` : 'Potential circular deadlock'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <SimulationControls
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
        nextStep={nextStep}
        prevStep={prevStep}
        resetSimulation={resetSimulation}
        togglePlay={togglePlay}
        goToStep={goToStep}
      />

      {/* Active Step Highlight Card */}
      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={currentStep.stepIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`
              p-5 rounded-3xl border backdrop-blur-2xl transition-all duration-300
              ${
                currentStep.type === 'PROCESS_SATISFIED'
                  ? 'bg-emerald-950/30 border-emerald-500/40 shadow-glass-glow-green'
                  : currentStep.type === 'PROCESS_BLOCKED'
                  ? 'bg-amber-950/30 border-amber-500/40 shadow-glass'
                  : currentStep.type === 'CONCLUSION_SAFE'
                  ? 'bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900/60 border-emerald-500/50 shadow-glass-glow-green'
                  : currentStep.type === 'CONCLUSION_UNSAFE'
                  ? 'bg-rose-950/40 border-rose-500/50 shadow-glass-glow-red'
                  : 'bg-slate-900/60 border-white/10 shadow-glass'
              }
            `}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-bold text-sm ${
                  currentStep.type === 'PROCESS_SATISFIED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : currentStep.type === 'PROCESS_BLOCKED'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-white/10 text-white'
                }`}>
                  #{currentStep.stepIndex + 1}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">{currentStep.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{currentStep.description}</p>
                </div>
              </div>

              {currentStep.need && currentStep.workBefore && (
                <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs font-mono">
                  <span className="text-cyan-300">Need: [{currentStep.need.join(', ')}]</span>
                  <span className="text-slate-400">
                    {currentStep.satisfied ? '≤' : '>'}
                  </span>
                  <span className="text-indigo-300">Work: [{currentStep.workBefore.join(', ')}]</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Work Vector & Finish Vector Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dynamic Work Vector */}
        <GlassCard
          title="Current Work Vector"
          subtitle="Dynamic working vector tracking unallocated resources during algorithm execution"
          icon={RefreshCw}
          glowColor="cyan"
        >
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
            {resourceNames.map((res, j) => (
              <div key={j} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{res}</span>
                <div className="text-xl font-mono font-extrabold text-cyan-300 mt-1">
                  {currentWork[j] ?? 0}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Dynamic Finish Vector */}
        <GlassCard
          title="Finish Vector"
          subtitle="Tracks boolean completion status for each process: Finish[i]"
          icon={CheckCircle2}
          glowColor="green"
        >
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {processNames.map((p, i) => {
              const isFinished = currentFinish[i] || false;
              const isCurrent = currentProcess === i;

              return (
                <div
                  key={i}
                  className={`flex-1 min-w-[70px] p-2.5 rounded-2xl border text-center transition-all ${
                    isFinished
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : isCurrent
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/30'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold">{p}</span>
                  <div className="text-xs font-bold mt-0.5">
                    {isFinished ? 'TRUE' : 'FALSE'}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Matrices Grid: Allocation, Max, Need */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation Matrix */}
        <GlassCard
          title="Allocation Matrix"
          subtitle="Resources currently allocated to each process"
          glowColor="blue"
        >
          <MatrixTable
            data={allocation}
            processNames={processNames}
            resourceNames={resourceNames}
            isReadOnly={true}
            highlightProcess={currentProcess}
          />
        </GlassCard>

        {/* Maximum Demand Matrix */}
        <GlassCard
          title="Maximum Demand Matrix"
          subtitle="Maximum declared claim of each process"
          glowColor="purple"
        >
          <MatrixTable
            data={max}
            processNames={processNames}
            resourceNames={resourceNames}
            isReadOnly={true}
            highlightProcess={currentProcess}
          />
        </GlassCard>

        {/* Need Matrix (Calculated) */}
        <GlassCard
          title="Need Matrix (Calculated)"
          subtitle="Need[i][j] = Max[i][j] - Allocation[i][j]"
          glowColor="cyan"
        >
          <MatrixTable
            data={need}
            processNames={processNames}
            resourceNames={resourceNames}
            isReadOnly={true}
            highlightProcess={currentProcess}
          />
        </GlassCard>
      </div>

      {/* Execution Step Log and Safe Sequence Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard
          className="lg:col-span-2"
          title="Algorithm Step-by-Step Execution Log"
          subtitle="Click on any step to jump the simulation state directly to that point"
          icon={Clock}
        >
          <ExecutionTimeline
            steps={steps}
            currentStepIndex={currentStepIndex}
            onSelectStep={goToStep}
          />
        </GlassCard>

        {/* Safe Sequence Resolution Card */}
        <GlassCard
          title="Safe Sequence Verdict"
          subtitle="Final outcome of safety algorithm"
          glowColor={isSafe ? 'green' : 'red'}
        >
          {isSafe ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Verified Safe Order:
                </span>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {safeSequence.map((p, idx) => (
                    <React.Fragment key={idx}>
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-mono font-bold text-sm">
                        {p}
                      </span>
                      {idx < safeSequence.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400/60" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                <p>
                  <strong>Why it is safe:</strong> Each process can finish without causing deadlock by waiting for earlier processes in the sequence to terminate and return their resources.
                </p>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-[11px] text-cyan-300">
                  Final Work Vector: [{safetyState.finalWork ? safetyState.finalWork.join(', ') : ''}]
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Deadlock Hazard
                </span>
                <p className="text-xs text-rose-200 leading-relaxed">
                  The system cannot guarantee safe completion for all processes. Unfinished processes:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {safetyState.unfinishedProcessNames?.map((p, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-200 border border-rose-500/30 font-mono text-xs font-bold">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                In an unsafe state, the operating system cannot prevent processes from entering circular wait if all remaining processes simultaneously request their maximum claims.
              </p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
