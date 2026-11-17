import React, { useMemo } from 'react';
import {
  Users,
  Layers,
  HardDrive,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import { RESOURCE_METADATA } from '../data/initialData';
import { sound } from '../utils/audio';

export default function Dashboard({
  allocation = [],
  max = [],
  need = [],
  available = [],
  processNames = [],
  resourceNames = [],
  safetyState = {},
  setActiveTab,
}) {
  const isSafe = safetyState?.isSafe ?? true;
  const safeSequence = safetyState?.safeSequenceNames || [];
  const numProcesses = allocation.length;
  const numResources = available.length;

  // Calculate Total Resources: Available + Sum(Allocation)
  const resourceMetrics = useMemo(() => {
    return resourceNames.map((res, j) => {
      let allocatedTotal = 0;
      let maxTotal = 0;
      for (let i = 0; i < numProcesses; i++) {
        allocatedTotal += (allocation[i] && allocation[i][j]) ? allocation[i][j] : 0;
        maxTotal += (max[i] && max[i][j]) ? max[i][j] : 0;
      }
      const avail = available[j] || 0;
      const systemTotal = allocatedTotal + avail;
      const utilizationPercent = systemTotal > 0 ? Math.round((allocatedTotal / systemTotal) * 100) : 0;

      return {
        resource: res,
        fullName: RESOURCE_METADATA[res]?.name || `Resource ${res}`,
        allocated: allocatedTotal,
        available: avail,
        total: systemTotal,
        maxDemand: maxTotal,
        utilization: utilizationPercent,
        color: RESOURCE_METADATA[res]?.color || '#38bdf8',
      };
    });
  }, [allocation, max, available, resourceNames, numProcesses]);

  // Overall average system utilization
  const avgUtilization = useMemo(() => {
    if (resourceMetrics.length === 0) return 0;
    const sum = resourceMetrics.reduce((acc, curr) => acc + curr.utilization, 0);
    return Math.round(sum / resourceMetrics.length);
  }, [resourceMetrics]);

  // Process Status Pie Data
  const processStatusData = useMemo(() => {
    const finishedCount = safetyState.finish ? safetyState.finish.filter(Boolean).length : 0;
    const pendingCount = numProcesses - finishedCount;
    return [
      { name: 'Eligible / Completed', value: isSafe ? numProcesses : finishedCount, color: '#10b981' },
      { name: 'Unfinished / Blocked', value: isSafe ? 0 : pendingCount, color: '#f43f5e' },
    ];
  }, [numProcesses, safetyState.finish, isSafe]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Liquid Glass Accent */}
      <div className="relative rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-glass">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Operating Systems Core Kernel
              </span>
              <span className="text-xs text-slate-400">• Deadlock Avoidance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              BankerOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">Control Hub</span>
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Real-time deadlock avoidance engine evaluating process maximum claims, current allocations, and safe execution trajectories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('safety');
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white font-semibold text-sm shadow-glass-glow-blue transition-all"
            >
              <span>Run Safety Algorithm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('request');
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-sm font-semibold transition-all"
            >
              <span>Test Resource Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Processes"
          value={numProcesses}
          subtext={`P0 through P${numProcesses - 1}`}
          icon={Users}
          color="blue"
          badge="Active Tasks"
          onClick={() => setActiveTab('matrix')}
        />

        <StatCard
          title="Resource Types"
          value={numResources}
          subtext={`Vectors: [${resourceNames.join(', ')}]`}
          icon={Layers}
          color="purple"
          badge="Multitype"
          onClick={() => setActiveTab('matrix')}
        />

        <StatCard
          title="Available Resources"
          value={`[${available.join(', ')}]`}
          subtext={`Unassigned in pool`}
          icon={HardDrive}
          color="cyan"
          badge="Free Pool"
          onClick={() => setActiveTab('safety')}
        />

        <StatCard
          title="System State"
          value={isSafe ? 'SAFE' : 'UNSAFE'}
          subtext={isSafe ? 'No Deadlock risk' : 'Potential Deadlock'}
          icon={isSafe ? ShieldCheck : ShieldAlert}
          color={isSafe ? 'green' : 'red'}
          badge={isSafe ? 'Guaranteed Safe' : 'Hazard Detected'}
          badgeType={isSafe ? 'safe' : 'unsafe'}
          onClick={() => setActiveTab('safety')}
        />
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Allocation Breakdown Chart */}
        <GlassCard
          className="lg:col-span-2"
          title="Resource Allocation vs Available"
          subtitle="Distribution of system capacity between active allocations and the free pool"
          icon={BarChart3}
        >
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={resourceMetrics}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <XAxis
                  dataKey="resource"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/15 backdrop-blur-xl shadow-2xl text-xs space-y-1">
                          <p className="font-bold text-white">{data.fullName} ({label})</p>
                          <p className="text-blue-400">Allocated: <span className="font-mono font-bold">{data.allocated}</span></p>
                          <p className="text-cyan-400">Available: <span className="font-mono font-bold">{data.available}</span></p>
                          <p className="text-slate-300">Total System: <span className="font-mono font-bold">{data.total}</span></p>
                          <p className="text-emerald-400">Utilization: <span className="font-mono font-bold">{data.utilization}%</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
                <Bar
                  dataKey="allocated"
                  name="Allocated to Processes"
                  fill="#007AFF"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="available"
                  name="Available in Bank"
                  fill="#32ADE6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Safe Sequence & System Utilization Card */}
        <div className="space-y-6">
          <GlassCard
            title="Safe Execution Sequence"
            subtitle="Calculated trajectory avoiding deadlocks"
            icon={Activity}
            glowColor={isSafe ? 'green' : 'red'}
          >
            {isSafe && safeSequence.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    Verified Safe Execution Order
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {safeSequence.map((p, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-mono font-bold text-sm shadow-sm">
                          {p}
                        </span>
                        {idx < safeSequence.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-emerald-400/60" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every process can acquire its declared maximum resources sequentially and terminate safely without circular deadlock.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2">
                <p className="text-xs font-bold text-rose-300">
                  Unsafe State Detected
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No safe sequence exists. Remaining processes cannot satisfy their declared needs from available resources.
                </p>
              </div>
            )}
          </GlassCard>

          {/* Average Resource Utilization Gauge */}
          <GlassCard
            title="Overall Utilization"
            subtitle="Percentage of allocated resources"
            icon={TrendingUp}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {avgUtilization}%
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Active allocation ratio
                </p>
              </div>

              <div className="w-20 h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Allocated', value: avgUtilization, fill: '#007AFF' },
                        { name: 'Available', value: 100 - avgUtilization, fill: 'rgba(255,255,255,0.08)' },
                      ]}
                      innerRadius={25}
                      outerRadius={38}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
