import { play } from "cuelume"

export const THEME_CHANGE_EVENT = "theme-change"

export type Theme = "light" | "dark"

export function getResolvedTheme(): Theme {
  if (typeof document === "undefined") return "light"
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

export function setTheme(theme: Theme) {
  document.documentElement.classList[theme === "dark" ? "add" : "remove"](
    "dark",
  )
  window.dispatchEvent(
    new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }),
  )
}

export function toggleTheme() {
  play("toggle")
  setTheme(getResolvedTheme() === "dark" ? "light" : "dark")
}

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    (target instanceof HTMLElement && target.isContentEditable) ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

export function initThemeKeyboardShortcut() {
  document.addEventListener("keydown", (e) => {
    if (e.key !== "d" && e.key !== "D") return
    if (e.metaKey || e.ctrlKey || e.altKey) return
    if (isTypingTarget(e.target)) return

    e.preventDefault()
    toggleTheme()
  })
}
