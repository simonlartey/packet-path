import { describe, expect, it } from 'vitest'
import { generateLevel } from '../levelGenerator'

describe('generateLevel', () => {
  it('produces a grid with correct dimensions', () => {
    const level = generateLevel(1, 12345)
    expect(level.tiles.length).toBe(level.rows)
    level.tiles.forEach(row => expect(row.length).toBe(level.cols))
  })

  it('always has exactly one source and one destination', () => {
    for (const id of [1, 5, 10, 20, 30]) {
      const flat = generateLevel(id, id * 7919).tiles.flat()
      expect(flat.filter(t => t.type === 'source')).toHaveLength(1)
      expect(flat.filter(t => t.type === 'destination')).toHaveLength(1)
    }
  })

  it('is deterministic — same seed always gives the same level', () => {
    const a = generateLevel(7, 99999)
    const b = generateLevel(7, 99999)
    expect(JSON.stringify(a)).toBe(JSON.stringify(b))
  })

  it('produces different puzzles for different seeds', () => {
    const a = generateLevel(7, 11111)
    const b = generateLevel(7, 22222)
    expect(JSON.stringify(a.tiles)).not.toBe(JSON.stringify(b.tiles))
  })

  it('marks the level as generated and stores the seed', () => {
    const level = generateLevel(3, 42)
    expect(level.isGenerated).toBe(true)
    expect(level.seed).toBe(42)
  })

  it('scales grid size with depth', () => {
    const easy = generateLevel(1, 1)
    const hard = generateLevel(30, 1)
    expect(easy.rows).toBeLessThan(hard.rows)
    expect(easy.cols).toBeLessThan(hard.cols)
  })

  it('always has estimatedMoves greater than zero', () => {
    for (const id of [1, 5, 15, 25, 40]) {
      const level = generateLevel(id, id * 1337)
      expect(level.estimatedMoves).toBeGreaterThan(0)
    }
  })

  it('source and destination tiles are always locked', () => {
    for (const id of [1, 10, 25]) {
      const flat = generateLevel(id, id * 555).tiles.flat()
      expect(flat.find(t => t.type === 'source')?.locked).toBe(true)
      expect(flat.find(t => t.type === 'destination')?.locked).toBe(true)
    }
  })
})
