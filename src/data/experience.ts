export type ExperienceItem = {
  title: string
  company: string
  href?: string
  period: string
  current?: boolean
  /** Present when `current` — employer vs active client assignment */
  currentKind?: "employer" | "assignment"
}

export const experience: ExperienceItem[] = [
  {
    title: "Senior Frontend Engineer",
    company: "Coop Sverige",
    href: "https://www.coop.se",
    period: "2026",
    current: true,
    currentKind: "assignment",
  },
  {
    title: "Senior Frontend Engineer",
    company: "HomeQ",
    href: "https://www.homeq.se",
    period: "2026",
  },
  {
    title: "Senior Frontend Engineer",
    company: "SVT",
    href: "https://www.svt.se",
    period: "2024",
  },
  {
    title: "Senior Frontend Engineer",
    company: "Dinbox/RCO Security",
    href: "https://rco.se/",
    period: "2023",
  },
  {
    title: "Senior Frontend Engineer Consultant",
    company: "The Stellar Collective",
    href: "https://www.thestellarcollective.se",
    period: "2023",
    current: true,
    currentKind: "employer",
  },
  {
    title: "Co-founder",
    company: "Pluck",
    period: "2018",
  },
  {
    title: "Frontend Lead & Scrum Master",
    company: "Digitalist Sweden",
    href: "https://www.digitalist.se/",
    period: "2017",
  },
  {
    title: "Frontend Lead & Scrum Master",
    company: "Bricco",
    href: "https://www.bricco.se/",
    period: "2014",
  },
]
