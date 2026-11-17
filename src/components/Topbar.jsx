import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Menu,
  Sparkles,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { PRESETS } from '../data/presets';
import { sound } from '../utils/audio';

export default function Topbar({
  safetyState,
  activePresetId,
  loadPreset,
  resetToDefault,
  isPlaying,
  togglePlay,
  resetSimulation,
  soundEnabled,
  setSoundEnabled,
  setActiveTab,
  setIsMobileOpen,
}) {
  const isSafe = safetyState?.isSafe ?? true;
  const safeSeq = safetyState?.safeSequenceNames || [];

  return (
    <header className="sticky top-0 z-30 h-20 px-6 backdrop-blur-2xl bg-slate-950/60 border-b border-white/10 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & System State Pill */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Safe / Unsafe Status Capsule */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
          isSafe
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-glass-glow-green'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-glass-glow-red animate-pulse'
        }`}>
          <div className="relative flex items-center justify-center">
            {isSafe ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            )}
            <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
              isSafe ? 'bg-emerald-400' : 'bg-rose-400'
            } animate-ping`} />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase">
                {isSafe ? 'Safe State' : 'Unsafe State (Deadlock Risk)'}
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                isSafe ? 'bg-emerald-400/20 text-emerald-200' : 'bg-rose-400/20 text-rose-200'
              }`}>
                {isSafe ? 'VERIFIED' : 'HAZARD'}
              </span>
            </div>
            {isSafe && safeSeq.length > 0 && (
              <span className="text-[11px] font-mono text-emerald-200/90 hidden sm:inline">
                Sequence: {safeSeq.join(' → ')}
              </span>
            )}
            {!isSafe && (
              <span className="text-[11px] text-rose-300/90 hidden sm:inline">
                No safe execution path exists
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Presets, Controls & Utility Toggles */}
      <div className="flex items-center gap-2.5">
        {/* Scenario Presets Selector */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-400 font-medium">Scenario:</span>
          <select
            value={activePresetId}
            onChange={(e) => loadPreset(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-2"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Simulation Run/Pause */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pause Simulation' : 'Run Simulation'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-glass-glow-blue'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run</span>
              </>
            )}
          </button>

          <button
            onClick={resetSimulation}
            title="Reset Simulation Stepper"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            setSoundEnabled(!soundEnabled);
          }}
          title={soundEnabled ? 'Disable UI Sound Effects' : 'Enable UI Sound Effects'}
          className={`p-2.5 rounded-2xl border transition-all ${
            soundEnabled
              ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400'
              : 'bg-white/5 border-white/10 text-slate-500'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Educational Guide Shortcut */}
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('learn');
          }}
          title="Open Banker's Algorithm Theory Guide"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Docs</span>
        </button>
      </div>
    </header>
  );
}
