const ENDPOINT =
  "https://api.open-meteo.com/v1/forecast?latitude=59.3293&longitude=18.0686&current=temperature_2m,weather_code&timezone=Europe%2FStockholm&forecast_days=1"

const CACHE_KEY = "stockholm-weather"
const CACHE_MS = 15 * 60 * 1000

type WeatherKind = "clear" | "cloudy" | "fog" | "rain" | "snow" | "storm"

type StockholmWeather = {
  temperature: string
  label: string
  kind: WeatherKind
}

const LABELS: Record<WeatherKind, string> = {
  clear: "Clear",
  cloudy: "Cloudy",
  fog: "Fog",
  rain: "Rain",
  snow: "Snow",
  storm: "Storm",
}

function weatherKind(code: number): WeatherKind {
  if (code === 0) return "clear"
  if (code <= 3) return "cloudy"
  if (code === 45 || code === 48) return "fog"
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain"
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow"
  if (code >= 95) return "storm"
  return "cloudy"
}

type CacheEntry = {
  at: number
  weather: StockholmWeather
}

function readCache(): StockholmWeather | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry = JSON.parse(raw) as CacheEntry
    if (!entry.weather || Date.now() - entry.at > CACHE_MS) return null
    return entry.weather
  } catch {
    return null
  }
}

function writeCache(weather: StockholmWeather) {
  try {
    const entry: CacheEntry = { at: Date.now(), weather }
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // Ignore private-mode and quota failures; the live reading still shows.
  }
}

async function fetchStockholmWeather(): Promise<StockholmWeather | null> {
  const cached = readCache()
  if (cached) return cached

  const response = await fetch(ENDPOINT)
  if (!response.ok) return null

  const data = (await response.json()) as {
    current?: { temperature_2m?: number; weather_code?: number }
  }
  const temperature = data.current?.temperature_2m
  const code = data.current?.weather_code
  if (typeof temperature !== "number" || typeof code !== "number") return null

  const kind = weatherKind(code)
  const weather: StockholmWeather = {
    temperature: `${Math.round(temperature)}°C`,
    label: LABELS[kind],
    kind,
  }
  writeCache(weather)
  return weather
}

function applyWeather(node: HTMLElement, weather: StockholmWeather) {
  const label = node.querySelector<HTMLElement>("[data-weather-label]")
  const temp = node.querySelector<HTMLElement>("[data-weather-temp]")
  if (label) label.textContent = weather.label
  if (temp) temp.textContent = weather.temperature

  node.querySelectorAll("[data-weather-icon]").forEach((icon) => {
    icon.toggleAttribute(
      "hidden",
      icon.getAttribute("data-weather-icon") !== weather.kind,
    )
  })
}

export function initStockholmWeather(root: ParentNode = document) {
  const nodes = root.querySelectorAll<HTMLElement>("[data-stockholm-weather]")
  if (nodes.length === 0) return

  void fetchStockholmWeather()
    .then((weather) => {
      if (!weather) return
      nodes.forEach((node) => applyWeather(node, weather))
    })
    .catch(() => {
      // Leave the placeholder so a failed request never shows a fake reading.
    })
}
