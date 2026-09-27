import { useEffect, useState, type ComponentPropsWithoutRef } from "react"
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconMoon,
  IconSend,
  IconSun,
  IconVolume2,
  IconVolumeOff,
  type Icon,
} from "@tabler/icons-react"
import { AnimatePresence, motion } from "motion/react"
import { buttonVariants } from "@/components/ui/button"
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
import { cn } from "cn"

type ConnectVariant = "email" | "github" | "linkedin"

const CONNECTS: Record<
  ConnectVariant,
  { label: string; Icon: Icon; HoverIcon: Icon }
> = {
  email: { label: "Email", Icon: IconMail, HoverIcon: IconSend },
  github: {
    label: "GitHub",
    Icon: IconBrandGithub,
    HoverIcon: IconArrowUpRight,
  },
  linkedin: {
    label: "LinkedIn",
    Icon: IconBrandLinkedin,
    HoverIcon: IconArrowUpRight,
  },
}

const morphTransition = { type: "spring" as const, stiffness: 600, damping: 25 }
const pressTransition = { type: "spring" as const, stiffness: 500, damping: 25 }

function MorphIcon({
  hovered,
  Icon,
  HoverIcon,
}: {
  hovered: boolean
  Icon: Icon
  HoverIcon: Icon
}) {
  return (
    <span className="relative size-4 shrink-0">
      <AnimatePresence initial={false}>
        {!hovered ? (
          <motion.span
            key="icon1"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={morphTransition}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Icon size={16} stroke={1.5} />
          </motion.span>
        ) : (
          <motion.span
            key="icon2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={morphTransition}
            className="absolute inset-0 flex items-center justify-center"
          >
            <HoverIcon size={16} stroke={1.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

type MorphButtonShared = {
  label: string
  Icon: Icon
  HoverIcon: Icon
  className?: string
}

function MorphLink({
  label,
  Icon,
  HoverIcon,
  className,
  ...props
}: MorphButtonShared & ComponentPropsWithoutRef<typeof motion.a>) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.a
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
        className,
      )}
      {...props}
    >
      <MorphIcon hovered={hovered} Icon={Icon} HoverIcon={HoverIcon} />
      {label}
    </motion.a>
  )
}

function MorphToggle({
  label,
  Icon,
  HoverIcon,
  className,
  pressed,
  ...props
}: MorphButtonShared &
  Omit<ComponentPropsWithoutRef<typeof motion.button>, "children"> & {
    pressed: boolean
  }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      type="button"
      data-cuelume-hover="tick"
      aria-pressed={pressed}
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
        className,
      )}
      {...props}
    >
      <MorphIcon hovered={hovered} Icon={Icon} HoverIcon={HoverIcon} />
      {label}
    </motion.button>
  )
}

function ConnectMorphButton({
  variant,
  href,
}: {
  variant: ConnectVariant
  href: string
}) {
  const { label, Icon, HoverIcon } = CONNECTS[variant]

  return (
    <MorphLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      label={label}
      Icon={Icon}
      HoverIcon={HoverIcon}
    />
  )
}

function SoundToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(isSoundEnabled())

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ enabled: boolean }>).detail
      setEnabled(detail.enabled)
    }

    window.addEventListener(SOUND_CHANGE_EVENT, onChange)
    return () => window.removeEventListener(SOUND_CHANGE_EVENT, onChange)
  }, [])

  return (
    <MorphToggle
      pressed={enabled}
      aria-keyshortcuts="m"
      label={enabled ? "Sound on" : "Sound off"}
      Icon={enabled ? IconVolume2 : IconVolumeOff}
      HoverIcon={enabled ? IconVolumeOff : IconVolume2}
      onClick={() => toggleSound()}
    />
  )
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    setTheme(getResolvedTheme())

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ theme: Theme }>).detail
      setTheme(detail.theme)
    }

    window.addEventListener(THEME_CHANGE_EVENT, onChange)
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange)
  }, [])

  const isDark = theme === "dark"

  return (
    <MorphToggle
      pressed={isDark}
      aria-keyshortcuts="d"
      label={isDark ? "Dark" : "Light"}
      Icon={isDark ? IconSun : IconMoon}
      HoverIcon={isDark ? IconMoon : IconSun}
      onClick={() => toggleTheme()}
    />
  )
}

export function ConnectButtons() {
  return (
    <div className="mt-4 flex items-center gap-2">
      <ConnectMorphButton
        variant="email"
        href="mailto:adam.benals@gmail.com"
      />
      <ConnectMorphButton variant="github" href="https://github.com/desiboli" />
      <ConnectMorphButton
        variant="linkedin"
        href="https://www.linkedin.com/in/mustafa-alshammaa/"
      />
    </div>
  )
}

export function SiteControlButtons() {
  return (
    <div className="flex w-max flex-col items-start gap-2">
      <ThemeToggle />
      <SoundToggle />
    </div>
  )
}
