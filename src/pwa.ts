// Keeps the installed app up to date. iPhones/iPads keep installed web apps
// in memory for a long time, so we also check whenever the app comes back
// to the screen, and once an hour while it stays open.
import { registerSW } from 'virtual:pwa-register'

let registration: ServiceWorkerRegistration | undefined

const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(_url, r) {
    registration = r
    if (!r) return
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') r.update().catch(() => {})
    })
    setInterval(() => r.update().catch(() => {}), 60 * 60 * 1000)
  },
  onNeedRefresh() {
    updateSW(true)
  },
})

/** Manual "Check for updates" button. Reloads to pick up any new version. */
export async function checkForUpdates(): Promise<void> {
  try {
    await registration?.update()
  } catch {
    /* offline — just reload what we have */
  }
  // Give a new version a moment to install, then reload.
  setTimeout(() => location.reload(), 1500)
}

export const APP_VERSION = `${__APP_VERSION__} · ${__BUILD_TIME__}`
