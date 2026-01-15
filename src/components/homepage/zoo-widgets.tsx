// src/components/homepage/zoo-widgets.tsx
import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** ---------------------------
 *  Reusable tile (shared)
 *  --------------------------- */
type ImageCtaTileProps = {
  title: string
  subtitle?: string
  imageSrc: string
  imageAlt?: string
  ctaLabel: string
  href?: string
  onCtaClick?: () => void
  className?: string
  imageHeightClassName?: string
}

function ImageCtaTile({
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  ctaLabel,
  href,
  onCtaClick,
  className,
  imageHeightClassName = "h-28",
}: ImageCtaTileProps) {
  const button = (
    <Button
      type={href ? "button" : "button"}
      variant="secondary"
      className={cn(
        "h-9 w-full rounded-full bg-white/95 text-slate-900",
        "shadow-sm hover:bg-white"
      )}
      onClick={href ? undefined : onCtaClick}
    >
      {ctaLabel}
    </Button>
  )

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white",
        "shadow-[0_10px_24px_rgba(15,23,42,0.18)]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.22)]",
        className
      )}
    >
      <div className={cn("relative w-full", imageHeightClassName)}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className={cn(
            "h-full w-full object-cover",
            "transition-transform duration-300 group-hover:scale-[1.04]"
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
        <div className="pointer-events-none absolute left-4 top-4">
          <div className="text-lg font-semibold leading-tight text-white drop-shadow">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 text-sm text-white/80 drop-shadow">
              {subtitle}
            </div>
          ) : null}
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          {href ? (
            <a href={href} className="block">
              {button}
            </a>
          ) : (
            button
          )}
        </div>
      </div>
    </div>
  )
}

/** ---------------------------
 *  Widget 1: Zoobesuch Planen
 *  --------------------------- */
export type ZooPlanAction = {
  title: string
  subtitle?: string
  imageSrc: string
  ctaLabel: string
  href?: string
  onCtaClick?: () => void
}

type ZooVisitPlannerWidgetProps = {
  title?: string
  description?: string
  actions?: ZooPlanAction[]
  className?: string
}

export function ZooVisitPlannerWidget({
  title = "Zoobesuch Planen",
  description = "Tickets, Anreise und Zeiten auf einen Blick.",
  actions = [
    {
      title: "Tickets Kaufen",
      subtitle: "Online buchen und Zeit sparen.",
      imageSrc:
        "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80",
      ctaLabel: "Tickets Kaufen",
      href: "/purchaseTickets",
    },
    {
      title: "Anreise Planen",
      subtitle: "So findest du den schnellsten Weg.",
      imageSrc:
        "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80",
      ctaLabel: "Anreise Planen",
      href: "/map",
    },
  ],
  className,
}: ZooVisitPlannerWidgetProps) {
  const navigate = useNavigate()
  const resolvePath = React.useCallback((path: string) => {
    const segment = window.location.pathname.split("/")[1]
    const isLang = ["de", "en", "fr", "it"].includes(segment)
    return isLang ? `/${segment}${path.startsWith("/") ? path : `/${path}`}` : path
  }, [])

  return (
    <Card
      className={cn(
        "w-[520px] rounded-3xl border border-amber-100/70 bg-white",
        "shadow-[0_18px_40px_rgba(15,23,42,0.14)]",
        className
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-slate-900">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-slate-600">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-5">
          {actions.slice(0, 2).map((a) => (
            <ImageCtaTile
              key={a.title}
              title={a.title}
              subtitle={a.subtitle}
              imageSrc={a.imageSrc}
              ctaLabel={a.ctaLabel}
              onCtaClick={
                a.onCtaClick
                  ? a.onCtaClick
                  : a.href
                  ? () => navigate(resolvePath(a.href as string))
                  : undefined
              }
              imageHeightClassName="h-40"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/** ---------------------------
 *  Widget 2: What's new?
 *  --------------------------- */
export type WhatsNewItem = {
  title: string
  subtitle?: string
  imageSrc: string
  ctaLabel: string
  href?: string
  onCtaClick?: () => void
}

type WhatsNewWidgetProps = {
  title?: string
  description?: string
  items?: WhatsNewItem[]
  className?: string
}

export function WhatsNewWidget({
  title = "What’s new?",
  description = "Aktuelle News und besondere Momente im Zoo.",
  items = [
    {
      title: "New feeding time",
      subtitle: "Zweimal täglich live dabei.",
      imageSrc:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      ctaLabel: "View Page",
      href: "/news/feeding-time",
    },
    {
      title: "Baby animals",
      subtitle: "Frischer Nachwuchs im Zoo.",
      imageSrc:
        "/Fuchs.png",
      ctaLabel: "View Page",
      href: "/news/baby-animals",
    },
    {
      title: "New enclosure",
      subtitle: "Mehr Platz, bessere Sicht.",
      imageSrc:
        "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=1200&q=80",
      ctaLabel: "View Page",
      href: "/news/new-enclosure",
    },
  ],
  className,
}: WhatsNewWidgetProps) {
  const navigate = useNavigate()
  const resolvePath = React.useCallback((path: string) => {
    const segment = window.location.pathname.split("/")[1]
    const isLang = ["de", "en", "fr", "it"].includes(segment)
    return isLang ? `/${segment}${path.startsWith("/") ? path : `/${path}`}` : path
  }, [])

  return (
    <Card
      className={cn(
        "w-[620px] rounded-3xl border border-amber-100/70 bg-white",
        "shadow-[0_18px_40px_rgba(15,23,42,0.14)]",
        className
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-slate-900">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-slate-600">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-5">
          {items.slice(0, 3).map((it) => (
            <ImageCtaTile
              key={it.title}
              title={it.title}
              subtitle={it.subtitle}
              imageSrc={it.imageSrc}
              ctaLabel={it.ctaLabel}
              onCtaClick={
                it.onCtaClick
                  ? it.onCtaClick
                  : it.href
                  ? () => navigate(resolvePath(it.href as string))
                  : undefined
              }
              imageHeightClassName="h-40"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

type WeatherState = {
  temperature?: number
  wind?: number
  condition?: string
  hourly?: { time: string; temp: number }[]
  isLoading: boolean
  error?: string
}

const weatherLabels: Record<number, string> = {
  0: "Klarer Himmel",
  1: "Überwiegend klar",
  2: "Teilweise bewölkt",
  3: "Bewölkt",
  45: "Nebel",
  48: "Reifnebel",
  51: "Leichter Nieselregen",
  53: "Nieselregen",
  55: "Starker Nieselregen",
  61: "Leichter Regen",
  63: "Regen",
  65: "Starker Regen",
  71: "Leichter Schneefall",
  73: "Schneefall",
  75: "Starker Schneefall",
  80: "Regenschauer",
  81: "Starke Schauer",
  82: "Heftige Schauer",
  95: "Gewitter",
}

export function WeatherWidget({ className }: { className?: string }) {
  const [state, setState] = React.useState<WeatherState>({
    isLoading: true,
  })
  const isRainy = state.condition?.toLowerCase().includes("regen")
  const isStorm = state.condition?.toLowerCase().includes("gewitter")
  const isSnow = state.condition?.toLowerCase().includes("schnee")


  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=47.3700&longitude=8.5420&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m&timezone=auto"
        )
        if (!response.ok) {
          throw new Error("weather failed")
        }
        const data = await response.json()
        const temp = data?.current?.temperature_2m
        const wind = data?.current?.wind_speed_10m
        const code = data?.current?.weather_code
        const hourlyTimes: string[] = data?.hourly?.time ?? []
        const hourlyTemps: number[] = data?.hourly?.temperature_2m ?? []
        const today = data?.current?.time
          ? String(data.current.time).split("T")[0]
          : new Date().toISOString().split("T")[0]
        const hourly = hourlyTimes
          .map((time, idx) => ({
            time,
            temp: hourlyTemps[idx],
          }))
          .filter((slot) => {
            if (today && !slot.time.startsWith(today)) {
              return false
            }
            const hour = new Date(slot.time).getHours()
            return hour >= 8 && hour <= 17
          })

        setState({
          isLoading: false,
          temperature: typeof temp === "number" ? temp : undefined,
          wind: typeof wind === "number" ? wind : undefined,
          condition: typeof code === "number" ? weatherLabels[code] : undefined,
          hourly,
        })
      } catch (err) {
        setState({
          isLoading: false,
          error: "Wetterdaten gerade nicht verfügbar.",
        })
      }
    }

    fetchWeather()
  }, [])

  return (
    <Card
      className={cn(
        "w-[620px] h-[360px] rounded-3xl border border-sky-200/70 bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 text-white",
        "shadow-[0_18px_50px_rgba(15,23,42,0.2)]",
        className
      )}
    >
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold text-white">Zoo Zürich</CardTitle>
            <CardDescription className="text-sm text-white/80">
              Aktuelle Wetterlage
            </CardDescription>
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-white/70">
            Live
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-1">
        {state.isLoading ? (
          <div className="text-sm text-white/80">Lade Wetterdaten…</div>
        ) : state.error ? (
          <div className="text-sm text-white/80">{state.error}</div>
        ) : (
          <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between -mt-2">
              <div className="text-6xl font-light leading-none text-white">
                {state.temperature?.toFixed(0)}°
              </div>
              <div className="text-sm text-white/80">
                {state.condition ?? "Unbekannt"}
              </div>
            </div>

            {state.hourly?.length ? (
              <div className="rounded-2xl border border-white/20 bg-white/10 px-3 py-3">
                <TemperatureLineChart points={state.hourly} />
              </div>
            ) : null}

            <div className="flex items-center justify-between text-xs text-white/80">
              <span>Wind: {state.wind?.toFixed(0)} km/h</span>
              {state.wind && state.wind > 30 ? (
                <span className="text-white">Sturmwarnung</span>
              ) : (
                <span className="text-white">Ruhige Bedingungen</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TemperatureLineChart({
  points,
}: {
  points: { time: string; temp: number }[]
}) {
  if (!points.length) return null

  const temps = points.map((p) => p.temp)
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const range = Math.max(1, max - min)
  const width = 420
  const height = 120
  const paddingX = 48
  const paddingY = 16

  const toX = (index: number) =>
    paddingX + (index / (points.length - 1)) * (width - paddingX * 2)
  const toY = (value: number) =>
    paddingY + (1 - (value - min) / range) * (height - paddingY * 2)

  const path = points
    .map((p, index) => `${index === 0 ? "M" : "L"} ${toX(index)} ${toY(p.temp)}`)
    .join(" ")

  const yLabels = [Math.round(max), Math.round((max + min) / 2), Math.round(min)]

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      {yLabels.map((label) => (
        <text
          key={label}
          x={8}
          y={toY(label) + 4}
          fill="rgba(255,255,255,0.75)"
          fontSize="11"
        >
          {label}°
        </text>
      ))}
      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2"
      />
      <line
        x1={paddingX}
        y1={paddingY}
        x2={paddingX}
        y2={height - paddingY}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      <line
        x1={paddingX}
        y1={height - paddingY}
        x2={width - paddingX}
        y2={height - paddingY}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      {points.map((p, index) => (
        <circle
          key={p.time}
          cx={toX(index)}
          cy={toY(p.temp)}
          r="3.5"
          fill="white"
        />
      ))}
      {points.map((p, index) => (
        <text
          key={`${p.time}-label`}
          x={toX(index)}
          y={height - 2}
          textAnchor="middle"
          fill="rgba(255,255,255,0.75)"
          fontSize="11"
        >
          {new Date(p.time).toLocaleTimeString("de-CH", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </text>
      ))}
    </svg>
  )
}

/** Optional demo layout */
export function ZooWidgetsDemo() {
  return (
    <div className="flex items-start gap-8">
      <ZooVisitPlannerWidget />
      <WhatsNewWidget />
    </div>
  )
}
