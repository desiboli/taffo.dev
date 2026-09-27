import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "cn"

export type CurrentRoleKind = "employer" | "assignment"

type ExperienceCurrentBadgeProps = {
  period: string
  kind: CurrentRoleKind
  title: string
  company: string
  href?: string
  className?: string
}

const KIND_LABEL: Record<CurrentRoleKind, string> = {
  employer: "Current employer",
  assignment: "Current assignment",
}

const rowClassName =
  "flex w-full items-center gap-4 p-3 hover:bg-muted transition-colors"

export function ExperienceCurrentBadge({
  period,
  kind,
  title,
  company,
  href,
  className,
}: ExperienceCurrentBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          closeOnClick={false}
          className={cn(rowClassName, className)}
          data-cuelume-hover="press"
          render={
            href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" />
            ) : (
              <div />
            )
          }
        >
          <h3 className="min-w-0 flex-1 text-left">
            {title}{" "}
            <span className="text-xs text-muted-foreground">@ {company}</span>
          </h3>
          <span className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="typing-dot size-1.5 shrink-0 rounded-full bg-muted-foreground"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        </TooltipTrigger>
        <TooltipContent side="right">
          <span>{KIND_LABEL[kind]}</span>
          <span>·</span>
          <span className="text-background/70"> since {period}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
