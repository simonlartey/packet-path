import { describe, expect, it } from 'vitest'
import { createSeededRandom } from '../seededRandom'

describe('createSeededRandom', () => {
  it('produces values between 0 and 1', () => {
    const rand = createSeededRandom(42)
    for (let i = 0; i < 100; i++) {
      const value = rand()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  it('produces the same sequence for the same seed', () => {
    const rand1 = createSeededRandom(99)
    const rand2 = createSeededRandom(99)
    for (let i = 0; i < 20; i++) {
      expect(rand1()).toBe(rand2())
    }
  })

  it('produces different sequences for different seeds', () => {
    const rand1 = createSeededRandom(1)
    const rand2 = createSeededRandom(2)
    const results1 = Array.from({ length: 10 }, () => rand1())
    const results2 = Array.from({ length: 10 }, () => rand2())
    expect(results1).not.toEqual(results2)
  })
})
