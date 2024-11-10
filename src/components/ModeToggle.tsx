import * as React from "react"
import { Moon, Sun, Monitor, DotIcon } from "lucide-react"
import { useStore } from "@nanostores/react"
import { THEME_MAP, type ThemeKey, themeStore } from "@/stores/theme"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  const theme = useStore(themeStore)

  return (
    <div className="rounded-sm overflow-hidden flex gap-2 bg-gray-100 dark:bg-neutral-900">
      {Object.keys(THEME_MAP)
        .map((key) => {
          const themeKey = key as ThemeKey
          const isActive = theme === THEME_MAP[themeKey]

          return (
            <button
              key={key}
              className={cn("justify-between capitalize p-2", {
                "bg-gray-200 dark:bg-neutral-800": isActive,
              })}
              onClick={() => themeStore.set(THEME_MAP[themeKey])}
            >
              {themeKey === "system" && <Monitor className="size-3" />}
              {themeKey === "dark" && <Moon className="size-3" />}
              {themeKey === "light" && <Sun className="size-3" />}
              <span className="sr-only">Enable {themeKey} Theme</span>
            </button>
          )
        })
        .reverse()}
    </div>
  )
}
