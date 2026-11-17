import React from 'react';

export default function GlassCard({
  children,
  className = '',
  glowColor = 'blue', // 'blue' | 'purple' | 'cyan' | 'green' | 'red' | 'none'
  hoverEffect = false,
  padding = 'p-6',
  title,
  subtitle,
  icon: Icon,
  action,
}) {
  const glowStyles = {
    blue: 'border-blue-500/20 hover:border-blue-500/40 shadow-glass-glow-blue',
    purple: 'border-purple-500/20 hover:border-purple-500/40 shadow-glass-glow-purple',
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40 shadow-glass-glow-cyan',
    green: 'border-emerald-500/20 hover:border-emerald-500/40 shadow-glass-glow-green',
    red: 'border-rose-500/20 hover:border-rose-500/40 shadow-glass-glow-red',
    none: 'border-white/10 hover:border-white/20',
  };

  return (
    <div
      className={`
        relative rounded-3xl backdrop-blur-2xl bg-slate-900/60
        border transition-all duration-300
        ${glowStyles[glowColor] || glowStyles.blue}
        ${hoverEffect ? 'hover:translate-y-[-2px] hover:bg-slate-900/75' : ''}
        ${padding}
        ${className}
      `}
    >
      {/* Specular glass reflection bar */}
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      {/* Header if title or icon provided */}
      {(title || Icon || action) && (
        <div className="flex items-center justify-between mb-5 gap-3">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 shadow-inner">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {children}
    </div>
  );
}
