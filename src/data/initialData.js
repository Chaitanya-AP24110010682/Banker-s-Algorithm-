/**
 * Standard Banker's Algorithm Sample Data (Section 10)
 */

export const INITIAL_DATA = {
  processNames: ['P0', 'P1', 'P2', 'P3', 'P4'],
  resourceNames: ['A', 'B', 'C'],
  allocation: [
    [0, 1, 0], // P0
    [2, 0, 0], // P1
    [3, 0, 2], // P2
    [2, 1, 1], // P3
    [0, 0, 2], // P4
  ],
  max: [
    [7, 5, 3], // P0
    [3, 2, 2], // P1
    [9, 0, 2], // P2
    [2, 2, 2], // P3
    [4, 3, 3], // P4
  ],
  available: [3, 3, 2],
};

// Resource color themes and metadata
export const RESOURCE_METADATA = {
  A: { name: 'CPU Cores', color: '#007AFF', lightColor: '#60a5fa', gradient: 'from-blue-500 to-cyan-400' },
  B: { name: 'Memory (GB)', color: '#AF52DE', lightColor: '#c084fc', gradient: 'from-purple-500 to-pink-500' },
  C: { name: 'Disk I/O Channels', color: '#32ADE6', lightColor: '#38bdf8', gradient: 'from-cyan-400 to-teal-400' },
  D: { name: 'Network Sockets', color: '#34C759', lightColor: '#4ade80', gradient: 'from-emerald-400 to-green-500' },
  E: { name: 'GPU Accelerators', color: '#FF9500', lightColor: '#fb923c', gradient: 'from-amber-400 to-orange-500' },
};
