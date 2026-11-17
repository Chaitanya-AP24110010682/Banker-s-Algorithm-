import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Gauge,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Shield,
  Layers,
  FileJson,
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { PRESETS } from '../data/presets';
import { sound } from '../utils/audio';

export default function Settings({
  playbackSpeed,
  setPlaybackSpeed,
  soundEnabled,
  setSoundEnabled,
  activePresetId,
  loadPreset,
  resetToDefault,
  allocation,
  max,
  available,
  processNames,
  resourceNames,
}) {
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState(null);

  const handleExportJson = () => {
    sound.playClick();
    const exportData = {
      processNames,
      resourceNames,
      allocation,
      max,
      available,
      exportedAt: new Date().toISOString(),
      generator: 'BankerOS v2.4',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bankeros-state-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-500/10 text-slate-300 border border-white/10">
            System Preferences
          </span>
          <span className="text-xs text-slate-400">• Configuration & Persistence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Simulator Settings & Laboratory Controls
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Customize simulation playback, visual themes, audio synthesizer feedback, and data export.
        </p>
      </div>

      {/* Playback & Audio Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard
          title="Audio Feedback Synthesizer"
          subtitle="VisionOS acoustic feedback synthesized via Web Audio API"
          icon={soundEnabled ? Volume2 : VolumeX}
          glowColor="cyan"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <h4 className="text-sm font-semibold text-white">Enable Audio Alerts</h4>
                <p className="text-xs text-slate-400">Glass clicks, step ticks, and granted chimes</p>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setSoundEnabled(!soundEnabled);
                }}
                className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                  soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => sound.playSuccess()}
                disabled={!soundEnabled}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 disabled:opacity-30"
              >
                Test Success Chime
              </button>
              <button
                onClick={() => sound.playWarning()}
                disabled={!soundEnabled}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 disabled:opacity-30"
              >
                Test Warning Alert
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard
          title="Default Animation Speed"
          subtitle="Execution pacing for automated simulation stepper"
          icon={Gauge}
          glowColor="blue"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[0.5, 1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    sound.playClick();
                    setPlaybackSpeed(s);
                  }}
                  className={`py-3 rounded-2xl border font-mono font-bold text-sm transition-all ${
                    playbackSpeed === s
                      ? 'bg-blue-600 border-blue-400 text-white shadow-glass-glow-blue'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              Controls interval timing between safety checks (currently: {Math.round(1600 / playbackSpeed)}ms per step).
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Preset Scenarios Manager */}
      <GlassCard
        title="Curated Operating System Scenarios"
        subtitle="Load pre-configured pedagogical states for classroom demonstration"
        icon={Layers}
        glowColor="purple"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {PRESETS.map((p) => {
            const isActive = activePresetId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => loadPreset(p.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600/20 border-purple-400/60 shadow-glass-glow-purple ring-1 ring-purple-400/40'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-white">{p.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Export & Reset Controls */}
      <GlassCard
        title="State Backup & Laboratory Export"
        subtitle="Download state configuration or reset to textbook defaults"
        icon={FileJson}
      >
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-glass-glow-cyan transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Configuration JSON</span>
          </button>

          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white font-semibold text-xs transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Silberschatz Default</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
