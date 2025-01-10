import { describe, expect, it } from 'vitest'
import { calculateLevelScore, MINIMUM_ADVANCE_SCORE } from '../scoring'
import type { Level } from '../types'

const testLevel: Level = {
  id: 1,
  name: 'Test Level',
  description: 'A test level',
  rows: 5,
  cols: 5,
  tiles: [],
}

describe('calculateLevelScore', () => {
  it('rewards fewer moves with a higher score', () => {
    const fastScore = calculateLevelScore(testLevel, 2)
    const slowScore = calculateLevelScore(testLevel, 8)

    expect(fastScore.score).toBeGreaterThan(slowScore.score)
  })

  it('allows progression when score meets the minimum threshold', () => {
    const result = calculateLevelScore(testLevel, 2)

    expect(result.score).toBeGreaterThanOrEqual(MINIMUM_ADVANCE_SCORE)
    expect(result.canAdvance).toBe(true)
  })

  it('blocks progression when score is below the minimum threshold', () => {
    const result = calculateLevelScore(testLevel, 8)

    expect(result.score).toBeLessThan(MINIMUM_ADVANCE_SCORE)
    expect(result.canAdvance).toBe(false)
  })
})