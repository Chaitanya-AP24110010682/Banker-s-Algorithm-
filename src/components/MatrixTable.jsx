import React from 'react';
import { RESOURCE_METADATA } from '../data/initialData';

export default function MatrixTable({
  title,
  subtitle,
  data, // number[][] or number[]
  isVector = false,
  isReadOnly = false,
  processNames = [],
  resourceNames = [],
  onChangeCell, // (pIdx, rIdx, val) => void
  highlightProcess = null, // processIndex to highlight
  maxMatrix = null, // for Allocation vs Max validation
  className = '',
}) {
  const getResourceMeta = (resName) => {
    return RESOURCE_METADATA[resName] || {
      name: `Resource ${resName}`,
      color: '#38bdf8',
      lightColor: '#7dd3fc',
      gradient: 'from-blue-500 to-cyan-400',
    };
  };

  if (isVector) {
    const vectorData = Array.isArray(data) ? data : [];
    return (
      <div className={`overflow-x-auto ${className}`}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Resource
              </th>
              {resourceNames.map((res, j) => {
                const meta = getResourceMeta(res);
                return (
                  <th key={j} className="px-3 py-2 text-center">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border"
                      style={{
                        backgroundColor: `${meta.color}15`,
                        borderColor: `${meta.color}35`,
                        color: meta.lightColor,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                      {res}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-white/5 bg-white/[0.02]">
              <td className="px-3 py-3 text-xs font-bold text-slate-300">Available</td>
              {resourceNames.map((_, j) => {
                const val = vectorData[j] ?? 0;
                return (
                  <td key={j} className="px-2 py-2 text-center">
                    {isReadOnly ? (
                      <span className="inline-block px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono font-bold text-white text-sm min-w-[48px]">
                        {val}
                      </span>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        value={val}
                        onChange={(e) => onChangeCell && onChangeCell(j, e.target.value)}
                        className="w-16 px-2 py-1.5 text-center font-mono font-bold rounded-xl bg-slate-900/80 border border-white/20 text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm shadow-inner"
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // 2D Matrix Rendering
  const matrix = Array.isArray(data) ? data : [];

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Process
            </th>
            {resourceNames.map((res, j) => {
              const meta = getResourceMeta(res);
              return (
                <th key={j} className="px-3 py-2 text-center">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border"
                    style={{
                      backgroundColor: `${meta.color}15`,
                      borderColor: `${meta.color}35`,
                      color: meta.lightColor,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                    {res}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {matrix.map((row, i) => {
            const isRowHighlighted = highlightProcess === i;
            const pName = processNames[i] || `P${i}`;

            return (
              <tr
                key={i}
                className={`transition-colors duration-200 ${
                  isRowHighlighted
                    ? 'bg-blue-500/15 border-y border-blue-500/40 shadow-glass-glow-blue'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${
                    isRowHighlighted
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                      : 'bg-white/5 text-slate-300 border-white/10'
                  }`}>
                    {isRowHighlighted && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    )}
                    {pName}
                  </span>
                </td>

                {resourceNames.map((_, j) => {
                  const val = row[j] ?? 0;
                  const maxVal = maxMatrix && maxMatrix[i] ? maxMatrix[i][j] : undefined;
                  const hasError = maxVal !== undefined && val > maxVal;

                  return (
                    <td key={j} className="px-2 py-2 text-center">
                      {isReadOnly ? (
                        <span
                          className={`inline-block px-3 py-1.5 rounded-xl font-mono font-bold text-sm min-w-[48px] border transition-all ${
                            isRowHighlighted
                              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                              : 'bg-white/[0.03] border-white/10 text-slate-200'
                          }`}
                        >
                          {val}
                        </span>
                      ) : (
                        <div className="relative inline-block">
                          <input
                            type="number"
                            min="0"
                            value={val}
                            onChange={(e) => onChangeCell && onChangeCell(i, j, e.target.value)}
                            className={`w-16 px-2 py-1.5 text-center font-mono font-bold rounded-xl bg-slate-900/80 border text-sm transition-all focus:outline-none focus:ring-1 shadow-inner ${
                              hasError
                                ? 'border-rose-500/60 text-rose-300 focus:border-rose-400 focus:ring-rose-400 bg-rose-950/30'
                                : 'border-white/15 text-slate-100 focus:border-blue-400 focus:ring-blue-400'
                            }`}
                          />
                          {hasError && (
                            <span
                              title={`Allocation (${val}) cannot exceed Max (${maxVal})`}
                              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-950"
                            />
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
