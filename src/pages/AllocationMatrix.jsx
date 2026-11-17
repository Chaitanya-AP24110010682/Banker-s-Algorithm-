import React, { useState } from 'react';
import {
  Grid3X3,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import MatrixTable from '../components/MatrixTable';
import { PRESETS } from '../data/presets';
import { sound } from '../utils/audio';

export default function AllocationMatrix({
  allocation,
  max,
  need,
  available,
  processNames,
  resourceNames,
  validation,
  updateAllocationCell,
  updateMaxCell,
  updateAvailableCell,
  addProcess,
  removeProcess,
  addResource,
  removeResource,
  renameProcess,
  renameResource,
  resetToDefault,
  loadPreset,
  activePresetId,
}) {
  const [editingProcessIdx, setEditingProcessIdx] = useState(null);
  const [editingResourceIdx, setEditingResourceIdx] = useState(null);
  const [tempName, setTempName] = useState('');

  const numProcesses = allocation.length;
  const numResources = available.length;

  return (
    <div className="space-y-6">
      {/* Page Header & Quick Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
              Matrix Manager
            </span>
            <span className="text-xs text-slate-400">• Interactive Live Editor</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Editable Resource Allocation Matrices
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Modify values, add or remove processes and resources, and rename entities. The Need matrix and safety state update immediately.
          </p>
        </div>

        {/* Global Matrix Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => addProcess()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-glass-glow-blue transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Process</span>
          </button>

          <button
            onClick={() => addResource()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-glass-glow-purple transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Resource</span>
          </button>

          <button
            onClick={resetToDefault}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Example</span>
          </button>
        </div>
      </div>

      {/* Validation Banner if errors exist */}
      {!validation.isValid && (
        <div className="p-4 rounded-3xl bg-rose-500/15 border border-rose-500/30 text-rose-200 backdrop-blur-2xl space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>Matrix Validation Error Detected</span>
          </div>
          <ul className="list-disc list-inside text-xs space-y-1 font-mono text-rose-300">
            {validation.errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Editable Available Vector Card */}
      <GlassCard
        title="Available Vector (Editable)"
        subtitle="Unallocated free instances currently in the bank for each resource type"
        icon={Grid3X3}
        glowColor="cyan"
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Dimension: 1 × {numResources}
            </span>
          </div>
        }
      >
        <MatrixTable
          data={available}
          resourceNames={resourceNames}
          isVector={true}
          isReadOnly={false}
          onChangeCell={updateAvailableCell}
        />
      </GlassCard>

      {/* Process & Resource Manager Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Process Management Bar */}
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Processes ({numProcesses})
            </span>
            <span className="text-[11px] text-slate-400">Click to rename or remove</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {processNames.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono font-semibold text-slate-200 group"
              >
                {editingProcessIdx === idx ? (
                  <input
                    type="text"
                    value={tempName}
                    autoFocus
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => {
                      renameProcess(idx, tempName);
                      setEditingProcessIdx(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        renameProcess(idx, tempName);
                        setEditingProcessIdx(null);
                      }
                    }}
                    className="w-16 px-1 py-0.5 rounded bg-slate-950 text-white font-mono text-xs focus:outline-none"
                  />
                ) : (
                  <span
                    onClick={() => {
                      setEditingProcessIdx(idx);
                      setTempName(p);
                    }}
                    title="Click to rename"
                    className="cursor-pointer hover:text-cyan-300"
                  >
                    {p}
                  </span>
                )}

                {numProcesses > 1 && (
                  <button
                    onClick={() => removeProcess(idx)}
                    title={`Delete Process ${p}`}
                    className="text-slate-500 hover:text-rose-400 transition-colors ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resource Management Bar */}
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Resources ({numResources})
            </span>
            <span className="text-[11px] text-slate-400">Click to rename or remove</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {resourceNames.map((res, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono font-semibold text-slate-200 group"
              >
                {editingResourceIdx === idx ? (
                  <input
                    type="text"
                    value={tempName}
                    autoFocus
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => {
                      renameResource(idx, tempName);
                      setEditingResourceIdx(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        renameResource(idx, tempName);
                        setEditingResourceIdx(null);
                      }
                    }}
                    className="w-16 px-1 py-0.5 rounded bg-slate-950 text-white font-mono text-xs focus:outline-none"
                  />
                ) : (
                  <span
                    onClick={() => {
                      setEditingResourceIdx(idx);
                      setTempName(res);
                    }}
                    title="Click to rename"
                    className="cursor-pointer hover:text-cyan-300"
                  >
                    {res}
                  </span>
                )}

                {numResources > 1 && (
                  <button
                    onClick={() => removeResource(idx)}
                    title={`Delete Resource ${res}`}
                    className="text-slate-500 hover:text-rose-400 transition-colors ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Matrices: Allocation & Maximum Demand Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Matrix (Editable) */}
        <GlassCard
          title="Allocation Matrix (Editable)"
          subtitle="Directly edit quantities of resources held by each process"
          glowColor="blue"
        >
          <MatrixTable
            data={allocation}
            processNames={processNames}
            resourceNames={resourceNames}
            isReadOnly={false}
            onChangeCell={updateAllocationCell}
            maxMatrix={max}
          />
        </GlassCard>

        {/* Maximum Demand Matrix (Editable) */}
        <GlassCard
          title="Maximum Demand Matrix (Editable)"
          subtitle="Directly edit the upper bound claim for each process"
          glowColor="purple"
        >
          <MatrixTable
            data={max}
            processNames={processNames}
            resourceNames={resourceNames}
            isReadOnly={false}
            onChangeCell={updateMaxCell}
          />
        </GlassCard>
      </div>

      {/* Calculated Need Matrix (Read-Only) */}
      <GlassCard
        title="Need Matrix (Read-Only Dynamic Calculation)"
        subtitle="Computed strictly via Need[i][j] = Max[i][j] - Allocation[i][j]"
        glowColor="cyan"
        action={
          <span className="text-xs font-mono font-bold text-cyan-400 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/25">
            Auto-Synchronized
          </span>
        }
      >
        <MatrixTable
          data={need}
          processNames={processNames}
          resourceNames={resourceNames}
          isReadOnly={true}
        />
      </GlassCard>
    </div>
  );
}
