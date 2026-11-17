import React from 'react';
import {
  Cpu,
  Database,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCcw,
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import ResourceVisualizer from '../components/ResourceVisualizer';
import SimulationControls from '../components/SimulationControls';
import ExecutionTimeline from '../components/ExecutionTimeline';

export default function ExecutionVisualizer({
  allocation,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
              Live Graphical Visualizer
            </span>
            <span className="text-xs text-slate-400">• Process State Machine & Bank Pool</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Banker's Algorithm Execution Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Watch real-time resource allocations, state transitions (Waiting → Eligible → Executing → Completed), and resource reclamation to the Central Bank.
          </p>
        </div>

        {/* Status Pill */}
        <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2.5 backdrop-blur-xl ${
          isSafe
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-glass-glow-green'
            : 'bg-rose-500/15 border-rose-500/30 text-rose-300 shadow-glass-glow-red'
        }`}>
          {isSafe ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider">
            {isSafe ? 'Deadlock Avoidance Active' : 'Deadlock Condition Reached'}
          </span>
        </div>
      </div>

      {/* Playback Controls */}
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

      {/* Main Interactive Visualizer Canvas */}
      <ResourceVisualizer
        allocation={allocation}
        need={need}
        available={available}
        processNames={processNames}
        resourceNames={resourceNames}
        currentStep={currentStep}
        safetyState={safetyState}
      />

      {/* Step Log Timeline & Real-Time Sequence Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard
          className="lg:col-span-2"
          title="Live Algorithm Transition Log"
          subtitle="Mathematical vector updates occurring at each dispatch cycle"
          icon={Cpu}
        >
          <ExecutionTimeline
            steps={steps}
            currentStepIndex={currentStepIndex}
            onSelectStep={goToStep}
          />
        </GlassCard>

        {/* Safe Sequence Build Progress */}
        <GlassCard
          title="Safe Trajectory Stream"
          subtitle="Sequentially verified executable order"
          glowColor={isSafe ? 'green' : 'red'}
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Sequence Progression:
              </span>
              <div className="flex flex-wrap items-center gap-2 min-h-[44px] p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                {(currentStep?.safeSequenceNames || []).length > 0 ? (
                  currentStep.safeSequenceNames.map((p, idx) => (
                    <React.Fragment key={idx}>
                      <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-mono font-bold text-xs shadow-sm">
                        {p}
                      </span>
                      {idx < currentStep.safeSequenceNames.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400/60" />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No processes completed yet...</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-white">Mathematical Invariant:</p>
              <p className="font-mono text-[11px] text-cyan-300">
                Work(t+1) = Work(t) + Allocation(P_i)
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Upon receiving its maximum demand, process P_i is guaranteed to terminate in finite time, releasing all held resources back to the bank pool.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
