import { useRef, useState } from 'react'
import { CELEBRATION_DURATION_MS } from '../game/constants'

export function useCelebration(onComplete: () => void) {
  const [isCelebrating, setIsCelebrating] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  function startCelebration() {
    setIsCelebrating(true)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setIsCelebrating(false)
      onCompleteRef.current()
    }, CELEBRATION_DURATION_MS)
  }

  function clearCelebration() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsCelebrating(false)
  }

  return { isCelebrating, startCelebration, clearCelebration }
}
