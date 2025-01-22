import { describe, expect, it } from 'vitest'
import { calculateLevelScore } from '../scoring'
import type { Level } from '../types'

const testLevel: Level = {
  id: 1,
  name: 'Test Level',
  description: 'A test level',
  difficulty: 'Easy',
  estimatedMoves: 5,
  category: 'Test',
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

  it('rates Excellent when score reaches 1000', () => {
    const result = calculateLevelScore(testLevel, 1)

    expect(result.score).toBeGreaterThanOrEqual(1000)
    expect(result.rating).toBe('Excellent')
  })

  it('rates Complete when significantly over target moves', () => {
    const result = calculateLevelScore(testLevel, 8)

    expect(result.score).toBeLessThan(700)
    expect(result.rating).toBe('Complete')
  })
})