import { describe, expect, it } from 'vitest'
import { hasValidPath } from '../pathfinding'
import type { Level, Tile } from '../types'

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

describe('hasValidPath', () => {
  it('returns true when source and destination are connected', () => {
    const level: Level = {
      id: 1,
      name: 'Connected',
      description: 'Connected test level',
      difficulty: 'Easy',
      estimatedMoves: 1,
      category: 'Test',
      rows: 1,
      cols: 3,
      tiles: [
        [
          tile('0-0', 'source', 90, true),
          tile('0-1', 'straight', 90),
          tile('0-2', 'destination', 270, true),
        ],
      ],
    }

    expect(hasValidPath(level)).toBe(true)
  })

  it('returns false when a firewall blocks the route', () => {
    const level: Level = {
      id: 2,
      name: 'Blocked',
      description: 'Blocked test level',
      difficulty: 'Easy',
      estimatedMoves: 1,
      category: 'Test',
      rows: 1,
      cols: 3,
      tiles: [
        [
          tile('0-0', 'source', 90, true),
          tile('0-1', 'firewall', 0, true),
          tile('0-2', 'destination', 270, true),
        ],
      ],
    }

    expect(hasValidPath(level)).toBe(false)
  })

  it('returns false when connected tiles do not line up', () => {
    const level: Level = {
      id: 3,
      name: 'Misaligned',
      description: 'Misaligned test level',
      difficulty: 'Easy',
      estimatedMoves: 1,
      category: 'Test',
      rows: 1,
      cols: 3,
      tiles: [
        [
          tile('0-0', 'source', 90, true),
          tile('0-1', 'straight', 0),
          tile('0-2', 'destination', 270, true),
        ],
      ],
    }

    expect(hasValidPath(level)).toBe(false)
  })
})