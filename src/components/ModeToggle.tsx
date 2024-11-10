import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<
    "theme-light" | "dark" | "system"
  >("theme-light")

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setThemeState(isDarkMode ? "dark" : "theme-light")
  }, [])

  React.useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.classList[isDark ? "add" : "remove"]("dark")
  }, [theme])

  return (
    <div className="rounded-sm overflow-hidden inline-flex bg-gray-100 dark:bg-neutral-900">
      <button onClick={() => setThemeState("system")} className="p-2">
        <Monitor className="size-3" />
        <span className="sr-only">Enable system theme</span>
      </button>
      <button onClick={() => setThemeState("dark")} className="p-2">
        <Moon className="size-3" />
        <span className="sr-only">Enable dark theme</span>
      </button>
      <button onClick={() => setThemeState("theme-light")} className="p-2">
        <Sun className="size-3" />
        <span className="sr-only">Enable light theme</span>
      </button>
    </div>
  )
}
