import { bind, play, setEnabled } from "cuelume"

const STORAGE_KEY = "sound"

export const SOUND_CHANGE_EVENT = "sound-change"

export function isSoundEnabled() {
  if (typeof localStorage === "undefined") return false
  return localStorage.getItem(STORAGE_KEY) === "on"
}

function writeEnabled(enabled: boolean) {
  localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off")
}

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    (target instanceof HTMLElement && target.isContentEditable) ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

export function setSoundEnabled(enabled: boolean) {
  writeEnabled(enabled)
  setEnabled(enabled)
  window.dispatchEvent(
    new CustomEvent(SOUND_CHANGE_EVENT, { detail: { enabled } }),
  )
}

export function toggleSound() {
  const next = !isSoundEnabled()

  if (next) {
    setEnabled(true)
    play("toggle")
    writeEnabled(true)
    window.dispatchEvent(
      new CustomEvent(SOUND_CHANGE_EVENT, { detail: { enabled: true } }),
    )
    return
  }

  // Mute after the click cue is scheduled. An immediate setEnabled(false)
  // drops the sound while AudioContext.resume() is still pending.
  play("toggle")
  writeEnabled(false)
  window.dispatchEvent(
    new CustomEvent(SOUND_CHANGE_EVENT, { detail: { enabled: false } }),
  )
  window.setTimeout(() => {
    if (!isSoundEnabled()) setEnabled(false)
  }, 50)
}

export function initSound() {
  bind()

  const enabled = isSoundEnabled()
  setEnabled(enabled)

  document.addEventListener("keydown", (e) => {
    if (e.key !== "m" && e.key !== "M") return
    if (e.metaKey || e.ctrlKey || e.altKey) return
    if (isTypingTarget(e.target)) return

    e.preventDefault()
    toggleSound()
  })
}
