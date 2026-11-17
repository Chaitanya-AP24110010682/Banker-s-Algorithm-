import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  color = 'blue',
  badge,
  badgeType = 'neutral',
  onClick,
}) {
  const colorMap = {
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      glow: 'shadow-glass-glow-blue',
      gradient: 'from-blue-500/10 to-transparent',
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      glow: 'shadow-glass-glow-purple',
      gradient: 'from-purple-500/10 to-transparent',
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      glow: 'shadow-glass-glow-cyan',
      gradient: 'from-cyan-500/10 to-transparent',
    },
    green: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      glow: 'shadow-glass-glow-green',
      gradient: 'from-emerald-500/10 to-transparent',
    },
    red: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      glow: 'shadow-glass-glow-red',
      gradient: 'from-rose-500/10 to-transparent',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  const badgeStyles = {
    safe: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    unsafe: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    neutral: 'bg-white/10 text-slate-300 border-white/10',
    active: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-3xl p-5
        bg-slate-900/65 backdrop-blur-2xl border
        ${scheme.border} ${scheme.glow}
        transition-colors duration-300
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Top light reflection */}
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

      {/* Ambient gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${scheme.gradient} pointer-events-none`} />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
            {value}
          </div>
          {subtext && <p className="mt-1 text-xs text-slate-400">{subtext}</p>}
        </div>

        <div className="flex flex-col items-end gap-2">
          {Icon && (
            <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-lg ${scheme.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          {badge && (
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyles[badgeType] || badgeStyles.neutral}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
