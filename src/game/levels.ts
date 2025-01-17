import type { Level, Tile } from './types'

const tile = (
  id: string,
  type: Tile['type'],
  rotation = 0,
  locked = false,
): Tile => ({
  id,
  type,
  rotation,
  locked,
})

export const levels: Level[] = [
  {
    id: 1,
    name: 'First Connection',
    description: 'Rotate the network tiles to connect the source to the destination.',
    difficulty: 'Easy',
    estimatedMoves: 3,
    category: 'Starter Route',
    rows: 5,
    cols: 5,
    tiles: [
      [
        tile('0-0', 'empty'),
        tile('0-1', 'empty'),
        tile('0-2', 'empty'),
        tile('0-3', 'empty'),
        tile('0-4', 'empty'),
      ],
      [
        tile('1-0', 'source', 90, true),
        tile('1-1', 'straight', 90),
        tile('1-2', 'corner', 0),
        tile('1-3', 'empty'),
        tile('1-4', 'empty'),
      ],
      [
        tile('2-0', 'empty'),
        tile('2-1', 'firewall', 0, true),
        tile('2-2', 'corner', 0),
        tile('2-3', 'straight', 90),
        tile('2-4', 'destination', 270, true),
      ],
      [
        tile('3-0', 'empty'),
        tile('3-1', 'empty'),
        tile('3-2', 'empty'),
        tile('3-3', 'straight', 0),
        tile('3-4', 'empty'),
      ],
      [
        tile('4-0', 'empty'),
        tile('4-1', 'empty'),
        tile('4-2', 'empty'),
        tile('4-3', 'empty'),
        tile('4-4', 'empty'),
      ],
    ],
  },
  {
    id: 2,
    name: 'Firewall Detour',
    description: 'Route around blocked nodes and restore the packet path.',
    difficulty: 'Medium',
    estimatedMoves: 5,
    category: 'Firewall Detour',
    rows: 5,
    cols: 5,
    tiles: [
      [
        tile('0-0', 'empty'),
        tile('0-1', 'empty'),
        tile('0-2', 'empty'),
        tile('0-3', 'empty'),
        tile('0-4', 'empty'),
      ],
      [
        tile('1-0', 'source', 90, true),
        tile('1-1', 'corner', 180),
        tile('1-2', 'firewall', 0, true),
        tile('1-3', 'corner', 0),
        tile('1-4', 'destination', 270, true),
      ],
      [
        tile('2-0', 'empty'),
        tile('2-1', 'corner', 0),
        tile('2-2', 'straight', 90),
        tile('2-3', 'corner', 270),
        tile('2-4', 'empty'),
      ],
      [
        tile('3-0', 'empty'),
        tile('3-1', 'empty'),
        tile('3-2', 'firewall', 0, true),
        tile('3-3', 'empty'),
        tile('3-4', 'empty'),
      ],
      [
        tile('4-0', 'empty'),
        tile('4-1', 'empty'),
        tile('4-2', 'empty'),
        tile('4-3', 'empty'),
        tile('4-4', 'empty'),
      ],
    ],
  },
  {
    id: 3,
    name: 'Long Route',
    description: 'Use a longer route to guide the packet through the network.',
    difficulty: 'Hard',
    estimatedMoves: 7,
    category: 'Long Route',
    rows: 5,
    cols: 5,
    tiles: [
      [
        tile('0-0', 'empty'),
        tile('0-1', 'empty'),
        tile('0-2', 'empty'),
        tile('0-3', 'empty'),
        tile('0-4', 'empty'),
      ],
      [
        tile('1-0', 'source', 90, true),
        tile('1-1', 'straight', 0),
        tile('1-2', 'corner', 90),
        tile('1-3', 'empty'),
        tile('1-4', 'empty'),
      ],
      [
        tile('2-0', 'empty'),
        tile('2-1', 'empty'),
        tile('2-2', 'straight', 90),
        tile('2-3', 'corner', 0),
        tile('2-4', 'destination', 270, true),
      ],
      [
        tile('3-0', 'empty'),
        tile('3-1', 'firewall', 0, true),
        tile('3-2', 'corner', 180),
        tile('3-3', 'corner', 270),
        tile('3-4', 'empty'),
      ],
      [
        tile('4-0', 'empty'),
        tile('4-1', 'empty'),
        tile('4-2', 'empty'),
        tile('4-3', 'empty'),
        tile('4-4', 'empty'),
      ],
    ],
  },

  // ── Level 4 ──────────────────────────────────────────────────────────────
  // Solution path: (1,0)→(1,1)→(1,2)→(1,3)→(2,3)→(2,4)
  // Moves needed: (1,1)str 0→90 +1, (1,2)str 0→90 +1, (1,3)cor 0→180 +2, (2,3)cor 270→0 +1 = 5
  {
    id: 4,
    name: 'Subnet Shift',
    description: 'A short detour through a subnet junction brings the packet to its next hop.',
    difficulty: 'Medium',
    estimatedMoves: 5,
    category: 'Subnet Routing',
    rows: 5,
    cols: 5,
    tiles: [
      [
        tile('0-0', 'empty'),
        tile('0-1', 'empty'),
        tile('0-2', 'empty'),
        tile('0-3', 'empty'),
        tile('0-4', 'empty'),
      ],
      [
        tile('1-0', 'source', 90, true),
        tile('1-1', 'straight', 0),
        tile('1-2', 'straight', 0),
        tile('1-3', 'corner', 0),
        tile('1-4', 'empty'),
      ],
      [
        tile('2-0', 'empty'),
        tile('2-1', 'firewall', 0, true),
        tile('2-2', 'empty'),
        tile('2-3', 'corner', 270),
        tile('2-4', 'destination', 270, true),
      ],
      [
        tile('3-0', 'empty'),
        tile('3-1', 'empty'),
        tile('3-2', 'straight', 0),
        tile('3-3', 'empty'),
        tile('3-4', 'empty'),
      ],
      [
        tile('4-0', 'empty'),
        tile('4-1', 'empty'),
        tile('4-2', 'empty'),
        tile('4-3', 'empty'),
        tile('4-4', 'empty'),
      ],
    ],
  },

  // ── Level 5 ──────────────────────────────────────────────────────────────
  // Solution path: (2,0)→(2,1)→(2,2)→(1,2)→(1,3)→(1,4)
  // Moves needed: (2,1)str 0→90 +1, (2,2)cor 90→270 +2, (1,2)cor 0→90 +1, (1,3)str 0→90 +1 = 5
  {
    id: 5,
    name: 'Proxy Bend',
    description: 'The packet must bend upward through a proxy relay before reaching its destination.',
    difficulty: 'Medium',
    estimatedMoves: 5,
    category: 'Subnet Routing',
    rows: 5,
    cols: 5,
    tiles: [
      [
        tile('0-0', 'empty'),
        tile('0-1', 'empty'),
        tile('0-2', 'empty'),
        tile('0-3', 'empty'),
        tile('0-4', 'empty'),
      ],
      [
        tile('1-0', 'empty'),
        tile('1-1', 'firewall', 0, true),
        tile('1-2', 'corner', 0),
        tile('1-3', 'straight', 0),
        tile('1-4', 'destination', 270, true),
      ],
      [
        tile('2-0', 'source', 90, true),
        tile('2-1', 'straight', 0),
        tile('2-2', 'corner', 90),
        tile('2-3', 'corner', 0),
        tile('2-4', 'empty'),
      ],
      [
        tile('3-0', 'empty'),
        tile('3-1', 'empty'),
        tile('3-2', 'empty'),
        tile('3-3', 'empty'),
        tile('3-4', 'empty'),
      ],
      [
        tile('4-0', 'empty'),
        tile('4-1', 'empty'),
        tile('4-2', 'empty'),
        tile('4-3', 'empty'),
        tile('4-4', 'empty'),
      ],
    ],
  },

  // ── Level 6 ──────────────────────────────────────────────────────────────
  // Solution path: (0,1)→(0,2)→(0,3)→(1,3)→(2,3)→(2,4)
  // Moves needed: (0,2)str 0→90 +1, (0,3)cor 0→180 +2, (1,3)str 90→0 +1, (2,3)cor 180→0 +2 = 6
  {
    id: 6,
    name: 'Firewall Maze',
    description: 'Two active firewalls narrow the viable route to a single compliant path.',
    difficulty: 'Medium',
    estimatedMoves: 6,
    category: 'Firewall Detour',
    rows: 5,
    cols: 5,
    tiles: [
      [
        tile('0-0', 'empty'),
        tile('0-1', 'source', 90, true),
        tile('0-2', 'straight', 0),
        tile('0-3', 'corner', 0),
        tile('0-4', 'empty'),
      ],
      [
        tile('1-0', 'empty'),
        tile('1-1', 'empty'),
        tile('1-2', 'firewall', 0, true),
        tile('1-3', 'straight', 90),
        tile('1-4', 'empty'),
      ],
      [
        tile('2-0', 'empty'),
        tile('2-1', 'empty'),
        tile('2-2', 'firewall', 0, true),
        tile('2-3', 'corner', 180),
        tile('2-4', 'destination', 270, true),
      ],
      [
        tile('3-0', 'empty'),
        tile('3-1', 'empty'),
        tile('3-2', 'empty'),
        tile('3-3', 'corner', 0),
        tile('3-4', 'empty'),
      ],
      [
        tile('4-0', 'empty'),
        tile('4-1', 'empty'),
        tile('4-2', 'empty'),
        tile('4-3', 'empty'),
        tile('4-4', 'empty'),
      ],
    ],
  },

  // ── Level 7 ──────────────────────────────────────────────────────────────
  // Solution path: (0,0)→(1,0)→(2,0)→(2,1)→(2,2)→(2,3)→(1,3)→(1,4)
  // Moves needed: (1,0)str 90→0 +1, (2,0)cor 270→0 +1, (2,1)str 0→90 +1,
  //               (2,2)str 0→90 +1, (2,3)cor 90→270 +2, (1,3)cor 0→90 +1 = 7
  {
    id: 7,
    name: 'Backbone Segment',
    description: 'Trace the packet along the network backbone and make the final turn to reach the destination.',
    difficulty: 'Medium',
    estimatedMoves: 7,
    category: 'Backbone Path',
    rows: 5,
    cols: 5,
    tiles: [
      [
        tile('0-0', 'source', 180, true),
        tile('0-1', 'empty'),
        tile('0-2', 'empty'),
        tile('0-3', 'empty'),
        tile('0-4', 'empty'),
      ],
      [
        tile('1-0', 'straight', 90),
        tile('1-1', 'firewall', 0, true),
        tile('1-2', 'empty'),
        tile('1-3', 'corner', 0),
        tile('1-4', 'destination', 270, true),
      ],
      [
        tile('2-0', 'corner', 270),
        tile('2-1', 'straight', 0),
        tile('2-2', 'straight', 0),
        tile('2-3', 'corner', 90),
        tile('2-4', 'empty'),
      ],
      [
        tile('3-0', 'empty'),
        tile('3-1', 'firewall', 0, true),
        tile('3-2', 'empty'),
        tile('3-3', 'empty'),
        tile('3-4', 'empty'),
      ],
      [
        tile('4-0', 'empty'),
        tile('4-1', 'empty'),
        tile('4-2', 'empty'),
        tile('4-3', 'empty'),
        tile('4-4', 'empty'),
      ],
    ],
  },

  // ── Level 8 ──────────────────────────────────────────────────────────────
  // Solution path: (3,0)→(2,0)→(1,0)→(1,1)→(1,2)→(2,2)→(2,3)→(2,4)
  // Moves needed: (2,0)str 90→0 +1, (1,0)cor 0→90 +1, (1,1)str 0→90 +1,
  //               (1,2)cor 90→180 +1, (2,2)cor 180→0 +2, (2,3)str 0→90 +1 = 7
  {
    id: 8,
    name: 'Encrypted Channel',
    description: 'Route through a secure tunnel segment that doubles back before reaching the endpoint.',
    difficulty: 'Medium',
    estimatedMoves: 7,
    category: 'Secure Channel',
    rows: 5,
    cols: 5,
    tiles: [
      [
        tile('0-0', 'empty'),
        tile('0-1', 'empty'),
        tile('0-2', 'firewall', 0, true),
        tile('0-3', 'corner', 0),
        tile('0-4', 'empty'),
      ],
      [
        tile('1-0', 'corner', 0),
        tile('1-1', 'straight', 0),
        tile('1-2', 'corner', 90),
        tile('1-3', 'empty'),
        tile('1-4', 'empty'),
      ],
      [
        tile('2-0', 'straight', 90),
        tile('2-1', 'firewall', 0, true),
        tile('2-2', 'corner', 180),
        tile('2-3', 'straight', 0),
        tile('2-4', 'destination', 270, true),
      ],
      [
        tile('3-0', 'source', 0, true),
        tile('3-1', 'empty'),
        tile('3-2', 'empty'),
        tile('3-3', 'empty'),
        tile('3-4', 'empty'),
      ],
      [
        tile('4-0', 'empty'),
        tile('4-1', 'empty'),
        tile('4-2', 'empty'),
        tile('4-3', 'empty'),
        tile('4-4', 'empty'),
      ],
    ],
  },

  // ── Level 9 ──────────────────────────────────────────────────────────────
  // Solution path: (0,0)→(1,0)→(2,0)→(2,1)→(2,2)→(2,3)→(2,4)→(3,4)→(4,4)
  // Moves needed: (1,0)str 90→0 +1, (2,0)cor 270→0 +1, (2,1)str 0→90 +1,
  //               (2,2)str 0→90 +1, (2,3)str 0→90 +1, (2,4)cor 0→180 +2, (3,4)str 90→0 +1 = 8
  {
    id: 9,
    name: 'Data Relay',
    description: 'A long-haul path crosses the full width of the network before terminating at the relay exit.',
    difficulty: 'Medium',
    estimatedMoves: 8,
    category: 'Backbone Path',
    rows: 5,
    cols: 5,
    tiles: [
      [
        tile('0-0', 'source', 180, true),
        tile('0-1', 'empty'),
        tile('0-2', 'empty'),
        tile('0-3', 'empty'),
        tile('0-4', 'empty'),
      ],
      [
        tile('1-0', 'straight', 90),
        tile('1-1', 'firewall', 0, true),
        tile('1-2', 'empty'),
        tile('1-3', 'corner', 0),
        tile('1-4', 'empty'),
      ],
      [
        tile('2-0', 'corner', 270),
        tile('2-1', 'straight', 0),
        tile('2-2', 'straight', 0),
        tile('2-3', 'straight', 0),
        tile('2-4', 'corner', 0),
      ],
      [
        tile('3-0', 'empty'),
        tile('3-1', 'empty'),
        tile('3-2', 'empty'),
        tile('3-3', 'firewall', 0, true),
        tile('3-4', 'straight', 90),
      ],
      [
        tile('4-0', 'empty'),
        tile('4-1', 'empty'),
        tile('4-2', 'empty'),
        tile('4-3', 'empty'),
        tile('4-4', 'destination', 0, true),
      ],
    ],
  },

  // ── Level 10 ─────────────────────────────────────────────────────────────
  // Solution path: (4,0)→(3,0)→(2,0)→(1,0)→(1,1)→(1,2)→(1,3)→(1,4)→(2,4)→(3,4)
  // Moves: (3,0)str 90→0 +1, (2,0)str 90→0 +1, (1,0)cor 270→90 +2,
  //        (1,1)str 0→90 +1, (1,2)str 0→90 +1, (1,3)str 0→90 +1,
  //        (1,4)cor 0→180 +2, (2,4)str 90→0 +1 = 10
  {
    id: 10,
    name: 'Zero Trust Corridor',
    description: 'Every hop is scrutinised — route the packet along the only compliant path through the segment.',
    difficulty: 'Hard',
    estimatedMoves: 10,
    category: 'Secure Channel',
    rows: 5,
    cols: 5,
    tiles: [
      [
        tile('0-0', 'empty'),
        tile('0-1', 'empty'),
        tile('0-2', 'empty'),
        tile('0-3', 'empty'),
        tile('0-4', 'empty'),
      ],
      [
        tile('1-0', 'corner', 270),
        tile('1-1', 'straight', 0),
        tile('1-2', 'straight', 0),
        tile('1-3', 'straight', 0),
        tile('1-4', 'corner', 0),
      ],
      [
        tile('2-0', 'straight', 90),
        tile('2-1', 'firewall', 0, true),
        tile('2-2', 'empty'),
        tile('2-3', 'empty'),
        tile('2-4', 'straight', 90),
      ],
      [
        tile('3-0', 'straight', 90),
        tile('3-1', 'empty'),
        tile('3-2', 'firewall', 0, true),
        tile('3-3', 'corner', 0),
        tile('3-4', 'destination', 0, true),
      ],
      [
        tile('4-0', 'source', 0, true),
        tile('4-1', 'empty'),
        tile('4-2', 'empty'),
        tile('4-3', 'empty'),
        tile('4-4', 'empty'),
      ],
    ],
  },

  // ── Level 11 ─────────────────────────────────────────────────────────────
  // Solution path: (0,2)→(1,2)→(2,2)→(2,3)→(2,4)→(3,4)→(4,4)→(4,3)→(4,2)
  // Moves: (1,2)str 90→0 +1, (2,2)cor 180→0 +2, (2,3)str 0→90 +1,
  //        (2,4)cor 0→180 +2, (3,4)str 90→0 +1, (4,4)cor 90→270 +2, (4,3)str 0→90 +1 = 10
  {
    id: 11,
    name: 'Signal Bounce',
    description: 'The signal must change direction three times before it can reach the endpoint.',
    difficulty: 'Hard',
    estimatedMoves: 10,
    category: 'Backbone Path',
    rows: 5,
    cols: 5,
    tiles: [
      [
        tile('0-0', 'empty'),
        tile('0-1', 'empty'),
        tile('0-2', 'source', 180, true),
        tile('0-3', 'empty'),
        tile('0-4', 'empty'),
      ],
      [
        tile('1-0', 'empty'),
        tile('1-1', 'empty'),
        tile('1-2', 'straight', 90),
        tile('1-3', 'firewall', 0, true),
        tile('1-4', 'empty'),
      ],
      [
        tile('2-0', 'empty'),
        tile('2-1', 'firewall', 0, true),
        tile('2-2', 'corner', 180),
        tile('2-3', 'straight', 0),
        tile('2-4', 'corner', 0),
      ],
      [
        tile('3-0', 'empty'),
        tile('3-1', 'empty'),
        tile('3-2', 'firewall', 0, true),
        tile('3-3', 'empty'),
        tile('3-4', 'straight', 90),
      ],
      [
        tile('4-0', 'empty'),
        tile('4-1', 'empty'),
        tile('4-2', 'destination', 90, true),
        tile('4-3', 'straight', 0),
        tile('4-4', 'corner', 90),
      ],
    ],
  },

  // ── Level 12 ─────────────────────────────────────────────────────────────
  // Solution path: (4,1)→(3,1)→(2,1)→(1,1)→(1,2)→(1,3)→(1,4)→(2,4)→(3,4)→(4,4)
  // Moves: (3,1)str 90→0 +1, (2,1)str 90→0 +1, (1,1)cor 270→90 +2,
  //        (1,2)str 0→90 +1, (1,3)str 0→90 +1, (1,4)cor 0→180 +2,
  //        (2,4)str 90→0 +1, (3,4)str 90→0 +1 = 10
  {
    id: 12,
    name: 'Reroute Protocol',
    description: 'Firewalls seal every direct line — find the long way round to restore the connection.',
    difficulty: 'Hard',
    estimatedMoves: 10,
    category: 'Firewall Detour',
    rows: 5,
    cols: 5,
    tiles: [
      [
        tile('0-0', 'empty'),
        tile('0-1', 'empty'),
        tile('0-2', 'empty'),
        tile('0-3', 'empty'),
        tile('0-4', 'empty'),
      ],
      [
        tile('1-0', 'empty'),
        tile('1-1', 'corner', 270),
        tile('1-2', 'straight', 0),
        tile('1-3', 'straight', 0),
        tile('1-4', 'corner', 0),
      ],
      [
        tile('2-0', 'firewall', 0, true),
        tile('2-1', 'straight', 90),
        tile('2-2', 'firewall', 0, true),
        tile('2-3', 'empty'),
        tile('2-4', 'straight', 90),
      ],
      [
        tile('3-0', 'empty'),
        tile('3-1', 'straight', 90),
        tile('3-2', 'firewall', 0, true),
        tile('3-3', 'empty'),
        tile('3-4', 'straight', 90),
      ],
      [
        tile('4-0', 'empty'),
        tile('4-1', 'source', 0, true),
        tile('4-2', 'empty'),
        tile('4-3', 'empty'),
        tile('4-4', 'destination', 0, true),
      ],
    ],
  },

  // ── Level 13 ─────────────────────────────────────────────────────────────
  // Solution path: (4,4)→(4,3)→(4,2)→(3,2)→(2,2)→(1,2)→(1,1)→(1,0)→(2,0)→(3,0)→(4,0)
  // Moves: (4,3)str 0→90 +1, (4,2)cor 270→0 +1, (3,2)str 90→0 +1,
  //        (2,2)str 90→0 +1, (1,2)cor 0→180 +2, (1,1)str 0→90 +1,
  //        (1,0)cor 270→90 +2, (2,0)str 90→0 +1, (3,0)str 90→0 +1 = 11
  {
    id: 13,
    name: 'Deep Packet Inspection',
    description: 'The route snakes through the full grid — trace every segment carefully before committing.',
    difficulty: 'Hard',
    estimatedMoves: 11,
    category: 'Expert Route',
    rows: 5,
    cols: 5,
    tiles: [
      [
        tile('0-0', 'empty'),
        tile('0-1', 'empty'),
        tile('0-2', 'empty'),
        tile('0-3', 'empty'),
        tile('0-4', 'empty'),
      ],
      [
        tile('1-0', 'corner', 270),
        tile('1-1', 'straight', 0),
        tile('1-2', 'corner', 0),
        tile('1-3', 'firewall', 0, true),
        tile('1-4', 'empty'),
      ],
      [
        tile('2-0', 'straight', 90),
        tile('2-1', 'firewall', 0, true),
        tile('2-2', 'straight', 90),
        tile('2-3', 'firewall', 0, true),
        tile('2-4', 'empty'),
      ],
      [
        tile('3-0', 'straight', 90),
        tile('3-1', 'empty'),
        tile('3-2', 'straight', 90),
        tile('3-3', 'empty'),
        tile('3-4', 'empty'),
      ],
      [
        tile('4-0', 'destination', 0, true),
        tile('4-1', 'empty'),
        tile('4-2', 'corner', 270),
        tile('4-3', 'straight', 0),
        tile('4-4', 'source', 270, true),
      ],
    ],
  },
]