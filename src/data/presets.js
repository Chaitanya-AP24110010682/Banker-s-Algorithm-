/**
 * Curated presets for demonstrations, classroom teaching, and edge case testing.
 */

export const PRESETS = [
  {
    id: 'textbook-safe',
    name: "Standard Textbook (Safe)",
    badge: 'Safe State',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    description: "The classic Silberschatz Operating System Concepts example. System has safe sequence: P1 → P3 → P4 → P0 → P2.",
    data: {
      processNames: ['P0', 'P1', 'P2', 'P3', 'P4'],
      resourceNames: ['A', 'B', 'C'],
      allocation: [
        [0, 1, 0],
        [2, 0, 0],
        [3, 0, 2],
        [2, 1, 1],
        [0, 0, 2],
      ],
      max: [
        [7, 5, 3],
        [3, 2, 2],
        [9, 0, 2],
        [2, 2, 2],
        [4, 3, 3],
      ],
      available: [3, 3, 2],
    }
  },
  {
    id: 'deadlock-unsafe',
    name: "Deadlock Danger (Unsafe State)",
    badge: 'Unsafe State',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    description: "Available resources are severely depleted. No process can satisfy its remaining Need from current Available resources.",
    data: {
      processNames: ['P0', 'P1', 'P2', 'P3', 'P4'],
      resourceNames: ['A', 'B', 'C'],
      allocation: [
        [0, 1, 0],
        [3, 0, 1],
        [3, 0, 2],
        [2, 1, 1],
        [0, 0, 2],
      ],
      max: [
        [7, 5, 3],
        [4, 2, 2],
        [9, 0, 2],
        [2, 2, 2],
        [4, 3, 3],
      ],
      available: [0, 1, 0],
    }
  },
  {
    id: 'tight-margins',
    name: "Tight Margin Allocation",
    badge: 'Safe (Precarious)',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    description: "Only a single process (P2) is initially eligible. If any wrong resource is granted, deadlock immediately occurs.",
    data: {
      processNames: ['P0', 'P1', 'P2'],
      resourceNames: ['R1', 'R2'],
      allocation: [
        [1, 2],
        [1, 1],
        [2, 0],
      ],
      max: [
        [3, 4],
        [2, 3],
        [2, 1],
      ],
      available: [0, 1],
    }
  },
  {
    id: 'cloud-datacenter',
    name: "Cloud Server 4-Resource Cluster",
    badge: '4 Resources',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    description: "Modern enterprise scenario managing CPU, RAM, Disk Channels, and Network Sockets across 4 microservices.",
    data: {
      processNames: ['Auth-Svc', 'Payment-Svc', 'Database-Pod', 'Worker-Queue'],
      resourceNames: ['CPU', 'RAM', 'Disk', 'Net'],
      allocation: [
        [1, 0, 1, 1],
        [1, 2, 0, 0],
        [0, 1, 1, 0],
        [2, 1, 1, 0],
      ],
      max: [
        [2, 1, 2, 2],
        [2, 2, 1, 1],
        [1, 3, 2, 1],
        [3, 2, 2, 1],
      ],
      available: [1, 2, 1, 1],
    }
  }
];
