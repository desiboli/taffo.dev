import * as React from "react"
import {
  IconBookmark,
  IconBrandGithub,
  IconBrandLinkedin,
  IconHome,
  IconMail,
  IconMenu,
  IconMoon,
  IconNews,
  IconNotes,
  IconSun,
  IconUser,
  IconVolume2,
  IconVolumeOff,
} from "@tabler/icons-react"

import { play } from "cuelume"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import {
  isSoundEnabled,
  SOUND_CHANGE_EVENT,
  toggleSound,
} from "@/lib/sound"
import {
  getResolvedTheme,
  THEME_CHANGE_EVENT,
  toggleTheme,
  type Theme,
} from "@/lib/theme"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [theme, setThemeState] = React.useState<Theme>("light")
  const [soundEnabled, setSoundEnabled] = React.useState(false)

  function setMenuOpen(next: boolean | ((prev: boolean) => boolean)) {
    setOpen((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next
      if (resolved && !prev) play("bloom")
      return resolved
    })
  }

  React.useEffect(() => {
    setThemeState(getResolvedTheme())
    setSoundEnabled(isSoundEnabled())

    const onThemeChange = (e: Event) => {
      const detail = (e as CustomEvent<{ theme: Theme }>).detail
      setThemeState(detail.theme)
    }

    const onSoundChange = (e: Event) => {
      const detail = (e as CustomEvent<{ enabled: boolean }>).detail
      setSoundEnabled(detail.enabled)
    }

    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange)
    window.addEventListener(SOUND_CHANGE_EVENT, onSoundChange)
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange)
      window.removeEventListener(SOUND_CHANGE_EVENT, onSoundChange)
    }
  }, [])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setMenuOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Mobile/keyboard: keep page scroll pinned and constrain the open dialog to the
  // visual viewport. iOS scrolls the document when the search input focuses.
  React.useEffect(() => {
    if (!open) return

    const scrollX = window.scrollX
    const scrollY = window.scrollY

    const pinScroll = () => {
      if (window.scrollX !== scrollX || window.scrollY !== scrollY) {
        window.scrollTo(scrollX, scrollY)
      }
    }

    const syncVisualViewport = () => {
      const vv = window.visualViewport
      const popup = document.querySelector<HTMLElement>(
        '[data-slot="dialog-content"]',
      )
      const list = document.querySelector<HTMLElement>(
        '[data-slot="command-list"]',
      )

      if (vv && popup) {
        const top = vv.offsetTop + 12
        const maxHeight = Math.max(160, vv.height - 24)
        popup.style.top = `${top}px`
        popup.style.transform = "translateX(-50%)"
        popup.style.maxHeight = `${maxHeight}px`
      }

      if (list) {
        list.style.overscrollBehavior = "contain"
        list.style.touchAction = "pan-y"
      }

      pinScroll()
    }

    const isScrollable = (el: HTMLElement) => {
      const { overflowY } = window.getComputedStyle(el)
      return (
        (overflowY === "auto" || overflowY === "scroll") &&
        el.scrollHeight > el.clientHeight + 1
      )
    }

    const onTouchMove = (event: TouchEvent) => {
      const target = event.target
      if (!(target instanceof Element)) {
        event.preventDefault()
        return
      }

      let node: HTMLElement | null =
        target instanceof HTMLElement ? target : target.parentElement

      while (node) {
        if (node.dataset.slot === "dialog-content") break
        if (isScrollable(node)) return
        node = node.parentElement
      }

      event.preventDefault()
    }

    // Wait a frame so the dialog portal is mounted.
    const frame = window.requestAnimationFrame(syncVisualViewport)

    const vv = window.visualViewport
    vv?.addEventListener("resize", syncVisualViewport)
    vv?.addEventListener("scroll", syncVisualViewport)
    window.addEventListener("scroll", pinScroll, true)
    document.addEventListener("touchmove", onTouchMove, { passive: false })

    return () => {
      window.cancelAnimationFrame(frame)
      vv?.removeEventListener("resize", syncVisualViewport)
      vv?.removeEventListener("scroll", syncVisualViewport)
      window.removeEventListener("scroll", pinScroll, true)
      document.removeEventListener("touchmove", onTouchMove)

      const popup = document.querySelector<HTMLElement>(
        '[data-slot="dialog-content"]',
      )
      const list = document.querySelector<HTMLElement>(
        '[data-slot="command-list"]',
      )
      popup?.style.removeProperty("top")
      popup?.style.removeProperty("transform")
      popup?.style.removeProperty("max-height")
      list?.style.removeProperty("overscroll-behavior")
      list?.style.removeProperty("touch-action")
    }
  }, [open])

  function runCommand(command: () => void) {
    setMenuOpen(false)
    command()
  }

  return (
    <>
      <div className="flex items-center">
        <Kbd className="hidden bg-transparent text-muted-foreground/50 text-[8px] md:inline-flex">
          ⌘ K
        </Kbd>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open command menu"
          data-cuelume-hover="tick"
          onClick={() => setMenuOpen(true)}
        >
          <IconMenu size={16} stroke={1.5} />
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setMenuOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => runCommand(() => (window.location.href = "/"))}
            >
              <IconHome size={16} stroke={1.5} />
              <span>Home</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => (window.location.href = "/blog"))
              }
            >
              <IconNews size={16} stroke={1.5} />
              <span>Blog</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => (window.location.href = "/bookmarks"))
              }
            >
              <IconBookmark size={16} stroke={1.5} />
              <span>Bookmarks</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => (window.location.href = "/notes"))
              }
            >
              <IconNotes size={16} stroke={1.5} />
              <span>Notes</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => (window.location.href = "/about"))
              }
            >
              <IconUser size={16} stroke={1.5} />
              <span>About</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Connect">
            <CommandItem
              onSelect={() =>
                runCommand(
                  () => (window.location.href = "mailto:adam.benals@gmail.com"),
                )
              }
            >
              <IconMail size={16} stroke={1.5} />
              <span>Email</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  window.open("https://github.com/desiboli", "_blank"),
                )
              }
            >
              <IconBrandGithub size={16} stroke={1.5} />
              <span>GitHub</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  window.open(
                    "https://www.linkedin.com/in/mustafa-alshammaa/",
                    "_blank",
                  ),
                )
              }
            >
              <IconBrandLinkedin size={16} stroke={1.5} />
              <span>LinkedIn</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Preferences">
            <CommandItem onSelect={() => runCommand(() => toggleTheme())}>
              {theme === "dark" ? (
                <IconSun size={16} stroke={1.5} />
              ) : (
                <IconMoon size={16} stroke={1.5} />
              )}
              <span>Toggle theme</span>
              <CommandShortcut>D</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => toggleSound())}>
              {soundEnabled ? (
                <IconVolumeOff size={16} stroke={1.5} />
              ) : (
                <IconVolume2 size={16} stroke={1.5} />
              )}
              <span>{soundEnabled ? "Turn sound off" : "Turn sound on"}</span>
              <CommandShortcut>M</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
