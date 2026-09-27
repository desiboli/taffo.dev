import { useEffect, useState, type ReactNode } from "react"
import { IconCopy } from "@tabler/icons-react"
import { Popover } from "@base-ui/react/popover"
import { motion } from "motion/react"
import { buttonVariants } from "@/components/ui/button"
import { LiveOrb } from "@/components/ui/live-orb"
import {
  getResolvedTheme,
  THEME_CHANGE_EVENT,
  type Theme,
} from "@/lib/theme"
import { cn } from "cn"

const ASK_AI_PROMPT = `I'm looking at the website of Mustafa Alshammaa: https://taffo.dev.
Help me understand his background, experience, and work. Be ready to answer questions about his projects, provide insights, or help with similar work.`

const pressTransition = { type: "spring" as const, stiffness: 500, damping: 25 }

const TOOLS = [
  {
    label: "ChatGPT",
    href: `https://chatgpt.com/?q=${encodeURIComponent(ASK_AI_PROMPT)}`,
    icon: <ChatGptIcon />,
  },
  {
    label: "Claude",
    href: `https://claude.ai/new?q=${encodeURIComponent(ASK_AI_PROMPT)}`,
    icon: <ClaudeIcon />,
  },
  {
    label: "Google AI Mode",
    href: `https://www.google.com/search?udm=50&q=${encodeURIComponent(ASK_AI_PROMPT)}`,
    icon: <GoogleAiIcon />,
  },
  {
    label: "Grok",
    href: `https://grok.com/?q=${encodeURIComponent(ASK_AI_PROMPT)}`,
    icon: <GrokIcon />,
  },
  {
    label: "Perplexity",
    href: `https://www.perplexity.ai/search?q=${encodeURIComponent(ASK_AI_PROMPT)}`,
    icon: <PerplexityIcon />,
  },
] as const

export function AskAiButton() {
  const [hovered, setHovered] = useState(false)
  const [theme, setTheme] = useState<Theme>("light")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setTheme(getResolvedTheme())

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ theme: Theme }>).detail
      setTheme(detail.theme)
    }

    window.addEventListener(THEME_CHANGE_EVENT, onChange)
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange)
  }, [])

  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timeout)
  }, [copied])

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(ASK_AI_PROMPT)
      setCopied(true)
      return
    } catch {
      const area = document.createElement("textarea")
      area.value = ASK_AI_PROMPT
      area.setAttribute("readonly", "")
      area.style.position = "fixed"
      area.style.left = "-9999px"
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand("copy")
      area.remove()
      setCopied(ok)
    }
  }

  return (
    <Popover.Root
      onOpenChange={(open) => {
        if (!open) setCopied(false)
      }}
    >
      <Popover.Trigger
        nativeButton
        render={
          <motion.button
            type="button"
            data-cuelume-hover="tick"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            animate={{
              paddingLeft: hovered ? 16 : 12,
              paddingRight: hovered ? 16 : 12,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={pressTransition}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "transition-none!",
            )}
          />
        }
      >
        <span aria-hidden="true" className="pointer-events-none flex">
          <LiveOrb
            size={28}
            variant={theme === "dark" ? "white" : "black"}
          />
        </span>
        Ask AI
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner
          side="top"
          align="end"
          sideOffset={10}
          className="isolate z-50"
        >
          <Popover.Popup
            className={cn(
              "w-80 origin-(--transform-origin) rounded-3xl bg-popover p-4 text-popover-foreground shadow-xl ring-1 ring-foreground/10 outline-none",
              "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
              "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            )}
          >
            <Popover.Title className="text-base leading-none font-medium">
              Ask an AI about me
            </Popover.Title>
            <Popover.Description className="mt-2 text-sm text-muted-foreground">
              A fresh perspective, from your favorite assistant.
            </Popover.Description>

            <div className="mt-4 flex items-center justify-between gap-2">
              {TOOLS.map((tool) => (
                <a
                  key={tool.label}
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={tool.label}
                  title={tool.label}
                  className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors outline-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)] focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  {tool.icon}
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={copyPrompt}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-3 h-10 w-full",
              )}
            >
              <IconCopy size={16} stroke={1.5} />
              <span aria-live="polite">
                {copied ? "Copied" : "Copy the prompt instead"}
              </span>
            </button>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4.5"
      fill="currentColor"
    >
      {children}
    </svg>
  )
}

function ChatGptIcon() {
  return (
    <IconFrame>
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zm-9.022 12.608a4.476 4.476 0 0 1-2.876-1.04l.142-.081 4.778-2.758a.795.795 0 0 0 .393-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.495 4.494zm-9.66-4.125a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387 2.016-1.164a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.408-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zM8.307 12.863l-2.02-1.164a.08.08 0 0 1-.038-.057V6.074a4.5 4.5 0 0 1 7.376-3.454l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </IconFrame>
  )
}

function ClaudeIcon() {
  return (
    <IconFrame>
      <path d="m4.714 15.956 4.718-2.648.079-.23-.079-.128h-.231l-.789-.048-2.696-.073-2.337-.097-2.265-.122-.57-.121-.535-.704.055-.352.48-.322.686.061 1.518.103 2.277.158 1.651.097 2.447.255h.389l.054-.158-.134-.097-.103-.097-2.55-1.688-1.336-.971-.722-.492-.365-.461-.157-1.008.655-.722.881.061.224.06.893.687 1.906 1.475 2.49 1.834.364.303.145-.103.019-.073-.164-.273-1.354-2.447-1.445-2.489-.643-1.032-.17-.62c-.061-.254-.104-.467-.104-.728L6.287.134 6.7 0l.996.134.419.364.619 1.415 1.002 2.228 1.554 3.03.456.898.242.832.091.255h.158v-.146l.128-1.706.236-2.095.231-2.696.079-.759.377-.91.746-.492.583.279.48.686-.067.443-.285 1.852-.559 2.902-.364 1.943h.212l.243-.243.984-1.305 1.651-2.065.729-.819.85-.905.546-.431h1.032l.759 1.13-.34 1.165-1.063 1.348-.88 1.142-1.263 1.7-.79 1.36.073.109.188-.018 2.854-.607 1.542-.28 1.84-.315.831.388.091.395-.328.808-1.967.485-2.307.462-3.436.813-.043.031.049.061 1.548.146.662.036h1.621l3.018.225.789.522.474.637-.079.486-1.214.62-1.64-.39-3.824-.91-1.312-.328h-.182v.11l1.093 1.068 2.004 1.81 2.507 2.331.128.577-.322.455-.34-.049-2.204-1.657-.85-.747-1.925-1.621h-.127v.17l.443.65 2.344 3.521.121 1.081-.17.352-.607.212-.668-.121-1.372-1.925-1.141-1.942-.14.079-.674 7.255-.316.37-.728.28-.608-.462-.321-.746.322-1.476.388-1.924.316-1.53.285-1.901.17-.631-.012-.042-.14.018-1.433 1.967-2.18 2.945-1.724 1.846-.413.164-.716-.37.067-.662.4-.589 2.387-3.036 1.439-1.882.929-1.087-.006-.158h-.055l-6.338 4.117-1.13.145-.485-.455.06-.747.231-.243 1.907-1.311z" />
    </IconFrame>
  )
}

function GoogleAiIcon() {
  return (
    <IconFrame>
      <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
    </IconFrame>
  )
}

function GrokIcon() {
  return (
    <IconFrame>
      <path
        fillRule="evenodd"
        d="m9.27 15.29 7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169s-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383L24 .5l-3.301 3.305v-.01L9.267 15.292m-1.644 1.431c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.8 7.8 0 0 0-1.829-1A8.975 8.975 0 0 0 5.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"
      />
    </IconFrame>
  )
}

function PerplexityIcon() {
  return (
    <IconFrame>
      <path d="M22.4 7.09h-2.31V.07l-7.51 6.35V.16h-1.16v6.2L4.49 0v7.09H1.6v10.4h2.89V24l6.93-6.36v6.2h1.16v-6.05l6.93 6.18v-6.49h2.89V7.09zm-3.47-4.53v4.53h-5.35l5.35-4.53zm-13.28.07 4.87 4.46H5.65V2.63zM2.76 16.33V8.25h7.85l-6.12 6.11v1.97H2.76zm2.89 5.04v-3.89h.0001v-2.65l5.78-5.78v7.01l-5.78 5.3zm12.7.03-5.77-5.15V9.06l5.77 5.78v6.56zm2.89-5.07h-1.73v-1.97L13.4 8.25h7.84v8.08z" />
    </IconFrame>
  )
}
