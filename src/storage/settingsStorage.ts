const SETTINGS_KEY = 'packet-path-settings'

type Settings = { soundEnabled: boolean }

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, unknown>
      return { soundEnabled: parsed.soundEnabled !== false }
    }
  } catch {}
  return { soundEnabled: true }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {}
}
