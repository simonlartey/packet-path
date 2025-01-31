import { useState } from 'react'
import { loadSettings, saveSettings } from '../storage/settingsStorage'

export function useSettings() {
  const [soundEnabled, setSoundEnabled] = useState(() => loadSettings().soundEnabled)

  function toggleSound() {
    const next = !soundEnabled
    setSoundEnabled(next)
    saveSettings({ soundEnabled: next })
  }

  return { soundEnabled, toggleSound }
}
