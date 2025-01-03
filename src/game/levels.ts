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
]