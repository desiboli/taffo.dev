const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Stockholm",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
})

export function formatStockholmTime(date = new Date()) {
  const parts = formatter.formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "00"
  return `${part("hour")}:${part("minute")}:${part("second")}`
}

export function initStockholmClock(root: ParentNode = document) {
  const clocks = root.querySelectorAll<HTMLTimeElement>(
    "[data-stockholm-clock]",
  )
  if (clocks.length === 0) return

  const tick = () => {
    const now = new Date()
    const time = formatStockholmTime(now)
    const iso = now.toISOString()
    clocks.forEach((clock) => {
      clock.textContent = time
      clock.dateTime = iso
    })
  }

  tick()
  const msUntilNextSecond = 1000 - (Date.now() % 1000)
  window.setTimeout(() => {
    tick()
    window.setInterval(tick, 1000)
  }, msUntilNextSecond)
}
