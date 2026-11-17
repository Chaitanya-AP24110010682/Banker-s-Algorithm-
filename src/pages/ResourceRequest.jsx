import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Send,
  HelpCircle,
  Undo2,
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import MatrixTable from '../components/MatrixTable';
import { requestResources } from '../algorithms/resourceRequest';
import { sound } from '../utils/audio';

export default function ResourceRequest({
  allocation,
  max,
  need,
  available,
  processNames,
  resourceNames,
  applyGrantedRequest,
}) {
  const [selectedProcessIdx, setSelectedProcessIdx] = useState(1); // Default P1
  const [requestVector, setRequestVector] = useState(
    resourceNames.map((_, j) => (j === 0 ? 1 : j === 2 ? 2 : 0)) // default [1, 0, 2]
  );
  const [requestResult, setRequestResult] = useState(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  // Sync request vector size when resource count changes
  React.useEffect(() => {
    setRequestVector(prev => {
      const next = new Array(resourceNames.length).fill(0);
      for (let j = 0; j < Math.min(prev.length, resourceNames.length); j++) {
        next[j] = prev[j];
      }
      return next;
    });
  }, [resourceNames.length]);

  const pName = processNames[selectedProcessIdx] || `P${selectedProcessIdx}`;
  const currentNeedRow = need[selectedProcessIdx] || [];
  const currentAllocRow = allocation[selectedProcessIdx] || [];

  const handleRequestChange = (j, val) => {
    const num = parseInt(val, 10);
    const validNum = isNaN(num) || num < 0 ? 0 : num;
    setRequestVector(prev => {
      const next = [...prev];
      next[j] = validNum;
      return next;
    });
    setHasEvaluated(false);
  };

  const handleEvaluateRequest = () => {
    sound.playClick();
    const outcome = requestResources({
      processIndex: selectedProcessIdx,
      requestVector,
      allocation,
      max,
      available,
      processNames,
      resourceNames,
    });

    setRequestResult(outcome);
    setHasEvaluated(true);

    if (outcome.decision === 'GRANTED') {
      sound.playGranted();
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#34C759', '#32ADE6', '#007AFF'],
        });
      } catch (e) {}
    } else {
      sound.playWarning();
    }
  };

  const handlePresetSelect = (pIdx, vector) => {
    sound.playClick();
    setSelectedProcessIdx(pIdx);
    setRequestVector([...vector]);
    setHasEvaluated(false);
    setRequestResult(null);
  };

  const handleCommitRequest = () => {
    if (requestResult && requestResult.decision === 'GRANTED') {
      applyGrantedRequest(selectedProcessIdx, requestVector);
      setRequestResult(null);
      setHasEvaluated(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-500/10 text-purple-300 border border-purple-500/25">
              Algorithm 2
            </span>
            <span className="text-xs text-slate-400">• Dynamic Resource Allocation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Banker's Resource Request Algorithm
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Simulates dynamic process allocation requests with two validation checks and trial state safety verification.
          </p>
        </div>

        {/* Quick Scenario Preset Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handlePresetSelect(1, [1, 0, 2])}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all"
          >
            P1: [1, 0, 2] (Safe Grant)
          </button>
          <button
            onClick={() => handlePresetSelect(4, [3, 3, 0])}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition-all"
          >
            P4: [3, 3, 0] (Unsafe Deny)
          </button>
          <button
            onClick={() => handlePresetSelect(0, [8, 0, 0])}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all"
          >
            P0: [8, 0, 0] (Exceeds Need)
          </button>
        </div>
      </div>

      {/* Main Request Form & Two Checks Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Controls */}
        <GlassCard
          className="lg:col-span-1"
          title="Configure Request"
          subtitle="Select requesting process and quantity per resource"
          icon={ArrowRightLeft}
          glowColor="purple"
        >
          <div className="space-y-4">
            {/* Process Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Requesting Process
              </label>
              <select
                value={selectedProcessIdx}
                onChange={(e) => {
                  sound.playClick();
                  setSelectedProcessIdx(parseInt(e.target.value, 10));
                  setHasEvaluated(false);
                }}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-white/15 text-white font-semibold text-sm focus:outline-none focus:border-purple-400 cursor-pointer"
              >
                {processNames.map((p, idx) => (
                  <option key={idx} value={idx} className="bg-slate-900 text-slate-100">
                    {p} (Allocated: [{allocation[idx]?.join(', ')}], Need: [{need[idx]?.join(', ')}])
                  </option>
                ))}
              </select>
            </div>

            {/* Resource Quantities Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Resource Quantities Request[{pName}]
              </label>
              <div className="grid grid-cols-3 gap-2">
                {resourceNames.map((res, j) => (
                  <div key={j} className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{res}</span>
                    <input
                      type="number"
                      min="0"
                      value={requestVector[j] ?? 0}
                      onChange={(e) => handleRequestChange(j, e.target.value)}
                      className="w-full mt-1.5 py-1 text-center font-mono font-extrabold text-lg rounded-xl bg-slate-950/70 border border-white/20 text-purple-300 focus:outline-none focus:border-purple-400"
                    />
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Need: {currentNeedRow[j] ?? 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluate Button */}
            <button
              onClick={handleEvaluateRequest}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-glass-glow-purple transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Evaluate Request</span>
            </button>
          </div>
        </GlassCard>

        {/* Validation Checks Panel */}
        <GlassCard
          className="lg:col-span-2"
          title="Banker's Algorithm Validation Pipeline"
          subtitle="Sequential evaluation of claims, availability, and safety"
          icon={ShieldCheck}
          glowColor="blue"
        >
          <div className="space-y-4">
            {/* CHECK 1: Request <= Need */}
            <div className={`p-4 rounded-2xl border transition-all ${
              !hasEvaluated
                ? 'bg-white/[0.02] border-white/10'
                : requestResult?.check1?.passed
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-rose-500/10 border-rose-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasEvaluated && (
                    requestResult?.check1?.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">CHECK 1: Claim Validation (Request ≤ Need)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ensures process does not request more than its declared maximum demand.
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-white/5 border border-white/10">
                  {resourceNames.map((res, j) => (
                    <span key={j} className={requestVector[j] > (currentNeedRow[j] || 0) ? 'text-rose-400' : 'text-slate-300'}>
                      {requestVector[j]}≤{currentNeedRow[j] || 0}{j < resourceNames.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {hasEvaluated && (
                <p className={`mt-2 text-xs font-medium ${requestResult?.check1?.passed ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {requestResult?.check1?.message}
                </p>
              )}
            </div>

            {/* CHECK 2: Request <= Available */}
            <div className={`p-4 rounded-2xl border transition-all ${
              !hasEvaluated || !requestResult?.check1?.passed
                ? 'bg-white/[0.02] border-white/10 opacity-70'
                : requestResult?.check2?.passed
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-amber-500/10 border-amber-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasEvaluated && requestResult?.check1?.passed && (
                    requestResult?.check2?.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    )
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">CHECK 2: Resource Availability (Request ≤ Available)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Checks whether sufficient free resources exist in the bank to satisfy request immediately.
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-white/5 border border-white/10">
                  {resourceNames.map((res, j) => (
                    <span key={j} className={requestVector[j] > (available[j] || 0) ? 'text-amber-400' : 'text-slate-300'}>
                      {requestVector[j]}≤{available[j] || 0}{j < resourceNames.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {hasEvaluated && requestResult?.check1?.passed && (
                <p className={`mt-2 text-xs font-medium ${requestResult?.check2?.passed ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {requestResult?.check2?.message}
                </p>
              )}
            </div>

            {/* TRIAL ALLOCATION & SAFETY CHECK RESULT */}
            {hasEvaluated && requestResult?.check1?.passed && requestResult?.check2?.passed && (
              <div className={`p-4 rounded-2xl border ${
                requestResult?.decision === 'GRANTED'
                  ? 'bg-emerald-500/15 border-emerald-500/40'
                  : 'bg-rose-500/15 border-rose-500/40'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {requestResult?.decision === 'GRANTED' ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-400" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Trial State Safety Algorithm: {requestResult?.decision}
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {requestResult?.decisionReason}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${
                    requestResult?.decision === 'GRANTED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {requestResult?.decision}
                  </span>
                </div>

                {requestResult?.decision === 'GRANTED' && requestResult?.safetyResult && (
                  <div className="mt-3 pt-3 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-emerald-200 font-mono">
                      Safe Trajectory: &lt; {requestResult.safetyResult.safeSequenceNames.join(' → ')} &gt;
                    </span>
                    <button
                      onClick={handleCommitRequest}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all"
                    >
                      Permanently Commit Allocation
                    </button>
                  </div>
                )}

                {requestResult?.rolledBack && (
                  <div className="mt-2 text-[11px] text-rose-300/80 flex items-center gap-1.5 font-mono">
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Trial state rolled back automatically. No system matrices were altered.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Trial Matrices Comparison (Trial Allocation & Trial Available) */}
      {hasEvaluated && requestResult?.trialAllocation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard
            title={`Trial Allocation Matrix (P${selectedProcessIdx} updated)`}
            subtitle="Simulated allocations if request were accepted"
            glowColor="blue"
          >
            <MatrixTable
              data={requestResult.trialAllocation}
              processNames={processNames}
              resourceNames={resourceNames}
              isReadOnly={true}
              highlightProcess={selectedProcessIdx}
            />
          </GlassCard>

          <GlassCard
            title="Trial Available Vector"
            subtitle="Simulated available bank pool after subtracting request"
            glowColor="cyan"
          >
            <MatrixTable
              data={requestResult.trialAvailable}
              resourceNames={resourceNames}
              isVector={true}
              isReadOnly={true}
            />
          </GlassCard>
        </div>
      )}
    </div>
  );
}
