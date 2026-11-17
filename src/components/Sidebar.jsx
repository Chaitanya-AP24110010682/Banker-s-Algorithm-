import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShieldCheck,
  ArrowRightLeft,
  Grid3X3,
  Cpu,
  GraduationCap,
  Settings,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { sound } from '../utils/audio';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
  { id: 'safety', label: 'Safety Algorithm', icon: ShieldCheck, badge: 'Core' },
  { id: 'request', label: 'Resource Request', icon: ArrowRightLeft, badge: null },
  { id: 'matrix', label: 'Allocation Matrix', icon: Grid3X3, badge: 'Editable' },
  { id: 'visualizer', label: 'Execution Visualizer', icon: Cpu, badge: 'Interactive' },
  { id: 'learn', label: 'Learn Banker\'s', icon: GraduationCap, badge: 'Guide' },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
];

export default function Sidebar({ activeTab, setActiveTab, safetyState, isMobileOpen, setIsMobileOpen }) {
  const isSafe = safetyState?.isSafe ?? true;

  const handleNavClick = (id) => {
    sound.playClick();
    setActiveTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50
          w-72 flex flex-col justify-between
          backdrop-blur-3xl bg-slate-950/75 border-r border-white/10
          transition-transform duration-300 ease-out
          lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top brand header */}
        <div>
          <div className="p-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-400 p-[1px] shadow-glass-glow-blue">
                <div className="w-full h-full rounded-2xl bg-[#090d1a] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#090d1a]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-white">Banker<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">OS</span></span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">v2.4</span>
                </div>
                <p className="text-[11px] text-slate-400 tracking-tight">Deadlock Avoidance Simulator</p>
              </div>
            </div>

            {/* Quick Live Health Status Bar */}
            <div className={`mt-4 p-3 rounded-2xl border flex items-center justify-between transition-colors duration-300 ${
              isSafe
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/25 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {isSafe ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                )}
                <span className="text-xs font-semibold tracking-wide">
                  {isSafe ? 'SAFE SYSTEM' : 'UNSAFE STATE'}
                </span>
              </div>
              <span className="text-[10px] font-mono opacity-80">
                {isSafe ? 'No Deadlock' : 'Deadlock Risk'}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Simulation Engine</p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium
                    transition-all duration-200 group
                    ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
                  `}
                >
                  {/* Active glass highlight indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-cyan-500/10 border border-blue-400/40 shadow-glass-glow-blue"
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="relative z-10 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 m-3 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive OS Lab</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Dijkstra's Deadlock Avoidance algorithm evaluated in real-time with zero backend latency.
          </p>
          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span>Operating Systems Lab</span>
            <span className="font-mono text-cyan-400/80">O(m × n²)</span>
          </div>
        </div>
      </aside>
    </>
  );
}
