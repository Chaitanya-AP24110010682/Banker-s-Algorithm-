import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function SimulationControls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  nextStep,
  prevStep,
  resetSimulation,
  togglePlay,
  goToStep,
}) {
  const speeds = [0.5, 1, 2, 4];
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="relative rounded-3xl p-4 bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-glass">
      {/* Specular highlight */}
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Step indicator & scrubber */}
        <div className="w-full sm:w-auto flex-1 max-w-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
            <span className="flex items-center gap-1.5 font-semibold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Step {totalSteps > 0 ? currentStepIndex + 1 : 0} of {totalSteps}
            </span>
            <span>{Math.round(progressPercent)}% Completed</span>
          </div>

          <div
            className="relative h-2 w-full bg-white/10 rounded-full cursor-pointer overflow-hidden group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              const targetStep = Math.round(ratio * (totalSteps - 1));
              goToStep(targetStep);
            }}
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          {/* Previous Step */}
          <button
            onClick={prevStep}
            disabled={currentStepIndex <= 0}
            title="Previous Step (Left Arrow)"
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play (Space)'}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-glass-glow-blue ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            onClick={nextStep}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Next Step (Right Arrow)"
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={resetSimulation}
            title="Reset Simulation to Beginning"
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
          <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => {
                sound.playClick();
                setPlaybackSpeed(s);
              }}
              className={`px-2 py-1 rounded-xl text-xs font-mono font-semibold transition-all ${
                playbackSpeed === s
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
