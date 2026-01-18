// src/components/homepage/zoo-widgets.tsx
import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TranslationsContext } from "../TranslationsContext";

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
  title,
  description,
  actions,
  className,
}: ZooVisitPlannerWidgetProps) {
  const navigate = useNavigate()
  const context = React.useContext(TranslationsContext)
  if (!context) return null

  const { translations, lang } = context
  const t = translations.zooWidgets
  const langKey = lang as keyof typeof t.visitPlanner.title

  const resolvedTitle = title ?? t.visitPlanner.title[langKey]
  const resolvedDescription = description ?? t.visitPlanner.description[langKey]

  const resolvedActions: ZooPlanAction[] =
    actions ?? [
      {
        title: t.visitPlanner.actions.tickets.title[langKey],
        subtitle: t.visitPlanner.actions.tickets.subtitle[langKey],
        imageSrc:
          "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80",
        ctaLabel: t.visitPlanner.actions.tickets.ctaLabel[langKey],
        href: "/purchaseTickets",
      },
      {
        title: t.visitPlanner.actions.directions.title[langKey],
        subtitle: t.visitPlanner.actions.directions.subtitle[langKey],
        imageSrc:
          "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80",
        ctaLabel: t.visitPlanner.actions.directions.ctaLabel[langKey],
        href: "/map",
      },
    ]

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
          {resolvedTitle}
        </CardTitle>
        <CardDescription className="text-sm text-slate-600">
          {resolvedDescription}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-5">
          {resolvedActions.slice(0, 2).map((a) => (
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
 *  Widget 4: Tagesplan (30-Minuten Slots)
 *  --------------------------- */

type ScheduleEvent = {
  /** "HH:mm" */
  start: string
  /** optional, wenn du es anzeigen willst (z.B. "10:30") */
  end?: string
  /** translation-key, z.B. "feedingSavannah" */
  key: string
  /** optional translation-key, z.B. "savannahArea" */
  locationKey?: string
  /** optional icon name (nur als string, falls du später Icons willst) */
  kind?: string
}

type DailyScheduleJson = {
  /** 30-min slot start/end as "HH:mm" */
  day: {
    start: string
    end: string
  }
  /** events grouped by slot start time "HH:mm" */
  slots: Record<string, ScheduleEvent[]>
}

/**
 * Platzhalter-JSON (später kannst du das aus einer Datei/API laden)
 * Wichtig: Die keys (key/locationKey) werden über translations gerendert.
 */
const DAILY_SCHEDULE_PLACEHOLDER: DailyScheduleJson = {
  day: { start: "08:00", end: "18:00" },
  slots: {
    "08:00": [{ start: "08:00", end: "08:30", key: "gatesOpen", locationKey: "mainEntrance" }],
    "09:30": [{ start: "09:30", end: "10:00", key: "kidsQuiz", locationKey: "educationCorner" }],
    "10:30": [
      { start: "10:30", end: "11:00", key: "feedingSavannah", locationKey: "savannahArea" },
      { start: "10:30", end: "11:00", key: "foxTalk", locationKey: "foxEnclosure" },
    ],
    "12:00": [{ start: "12:00", end: "12:30", key: "keeperTalk", locationKey: "elephantHouse" }],
    "14:00": [{ start: "14:00", end: "14:30", key: "behindScenes", locationKey: "meetingPoint" }],
    "15:30": [{ start: "15:30", end: "16:00", key: "feedingSavannah", locationKey: "savannahArea" }],
    "17:30": [{ start: "17:30", end: "18:00", key: "gatesClose", locationKey: "mainEntrance" }],
  },
}

type DailyScheduleWidgetProps = {
  className?: string
  title?: string
  description?: string
  /** Optional: inject schedule JSON from outside (API, file, etc.) */
  schedule?: DailyScheduleJson
  /** Optional: override time window */
  start?: string
  end?: string
}

function parseTimeToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map((v) => Number(v))
  if (Number.isNaN(h) || Number.isNaN(m)) return 0
  return h * 60 + m
}

function minutesToHHmm(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const hh = String(h).padStart(2, "0")
  const mm = String(m).padStart(2, "0")
  return `${hh}:${mm}`
}

function buildHalfHourSlots(start: string, end: string) {
  const startMin = parseTimeToMinutes(start)
  const endMin = parseTimeToMinutes(end)
  const slots: string[] = []
  for (let t = startMin; t < endMin; t += 30) {
    slots.push(minutesToHHmm(t))
  }
  return slots
}

export function DailyScheduleWidget({
  className,
  title,
  description,
  schedule,
  start,
  end,
}: DailyScheduleWidgetProps) {
  const context = React.useContext(TranslationsContext)
  if (!context) return null

  const { translations, lang } = context
  const t = translations.zooWidgets
  const langKey = lang as keyof typeof t.dailySchedule.title

  const data = schedule ?? DAILY_SCHEDULE_PLACEHOLDER
  const windowStart = start ?? data.day.start
  const windowEnd = end ?? data.day.end

  const slots = React.useMemo(
    () => buildHalfHourSlots(windowStart, windowEnd),
    [windowStart, windowEnd]
  )

  const eventTitles = t.dailySchedule.events
  const locations = t.dailySchedule.locations

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
          {title ?? t.dailySchedule.title[langKey]}
        </CardTitle>
        <CardDescription className="text-sm text-slate-600">
          {description ?? t.dailySchedule.description[langKey]}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-2xl border border-amber-100/70 bg-amber-50/40 overflow-hidden">
          <div className="max-h-[320px] overflow-auto">
            {slots.map((time) => {
              const events = data.slots?.[time] ?? []
              return (
                <div
                  key={time}
                  className={cn(
                    "grid grid-cols-[88px_1fr] gap-4 px-5 py-4",
                    "border-b border-amber-100/70 last:border-b-0"
                  )}
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {time}
                  </div>

                  {events.length === 0 ? (
                    <div className="text-sm text-slate-500">
                      {t.dailySchedule.noEvents[langKey]}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {events.map((ev, idx) => {
                        const titleText =
                          eventTitles?.[ev.key as keyof typeof eventTitles]?.[langKey] ??
                          ev.key

                        const locationText = ev.locationKey
                          ? locations?.[ev.locationKey as keyof typeof locations]?.[langKey] ?? ev.locationKey
                          : undefined

                        return (
                          <div
                            key={`${time}-${ev.key}-${idx}`}
                            className={cn(
                              "rounded-xl border border-amber-100/70 bg-white",
                              "px-4 py-3 shadow-sm"
                            )}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="text-sm font-medium text-slate-900">
                                {titleText}
                              </div>
                              <div className="text-xs text-slate-500 whitespace-nowrap">
                                {ev.end ? `${ev.start}–${ev.end}` : ev.start}
                              </div>
                            </div>

                            {locationText ? (
                              <div className="mt-1 text-xs text-slate-600">
                                <span className="font-semibold">
                                  {t.dailySchedule.locationLabel[langKey]}:
                                </span>{" "}
                                {locationText}
                              </div>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            {t.dailySchedule.timeWindowLabel[langKey]}: {windowStart}–{windowEnd}
          </span>
          <span>
            {t.dailySchedule.slotSizeLabel[langKey]}: 30 {t.dailySchedule.minutes[langKey]}
          </span>
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
  title,
  description,
  items,
  className,
}: WhatsNewWidgetProps) {
  const navigate = useNavigate()
  const context = React.useContext(TranslationsContext)
  if (!context) return null

  const { translations, lang } = context
  const t = translations.zooWidgets
  const langKey = lang as keyof typeof t.whatsNew.title

  const resolvedTitle = title ?? t.whatsNew.title[langKey]
  const resolvedDescription = description ?? t.whatsNew.description[langKey]

  const resolvedItems: WhatsNewItem[] =
    items ?? [
      {
        title: t.whatsNew.items.feedingTime.title[langKey],
        subtitle: t.whatsNew.items.feedingTime.subtitle[langKey],
        imageSrc:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        ctaLabel: t.whatsNew.items.feedingTime.ctaLabel[langKey],
        href: "/news/feeding-time",
      },
      {
        title: t.whatsNew.items.babyAnimals.title[langKey],
        subtitle: t.whatsNew.items.babyAnimals.subtitle[langKey],
        imageSrc: "/Fuchs.png",
        ctaLabel: t.whatsNew.items.babyAnimals.ctaLabel[langKey],
        href: "/news/baby-animals",
      },
      {
        title: t.whatsNew.items.newEnclosure.title[langKey],
        subtitle: t.whatsNew.items.newEnclosure.subtitle[langKey],
        imageSrc:
          "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=1200&q=80",
        ctaLabel: t.whatsNew.items.newEnclosure.ctaLabel[langKey],
        href: "/news/new-enclosure",
      },
    ]

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
          {resolvedTitle}
        </CardTitle>
        <CardDescription className="text-sm text-slate-600">
          {resolvedDescription}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-5">
          {resolvedItems.slice(0, 3).map((it) => (
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

type WeatherTranslations = {
  locationName: Record<"de" | "en" | "it" | "fr", string>
  headline: Record<"de" | "en" | "it" | "fr", string>
  live: Record<"de" | "en" | "it" | "fr", string>
  loading: Record<"de" | "en" | "it" | "fr", string>
  unknown: Record<"de" | "en" | "it" | "fr", string>
  windLabel: Record<"de" | "en" | "it" | "fr", string>
  stormWarning: Record<"de" | "en" | "it" | "fr", string>
  calm: Record<"de" | "en" | "it" | "fr", string>
  errorUnavailable: Record<"de" | "en" | "it" | "fr", string>
  labels: Record<string, Record<"de" | "en" | "it" | "fr", string>>
}

export function WeatherWidget({ className }: { className?: string }) {
  const context = React.useContext(TranslationsContext)
  if (!context) return null

  const { translations, lang } = context
  const t = translations.zooWidgets
  const langKey = lang as keyof WeatherTranslations["headline"]

  const weatherLabels = t.weather.labels as WeatherTranslations["labels"]

  const [state, setState] = React.useState<WeatherState>({
    isLoading: true,
  })

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

        const condition =
          typeof code === "number"
            ? weatherLabels[String(code)]?.[langKey] ?? undefined
            : undefined

        setState({
          isLoading: false,
          temperature: typeof temp === "number" ? temp : undefined,
          wind: typeof wind === "number" ? wind : undefined,
          condition,
          hourly,
        })
      } catch (err) {
        setState({
          isLoading: false,
          error: t.weather.errorUnavailable[langKey],
        })
      }
    }

    fetchWeather()
  }, [langKey, t.weather.errorUnavailable])

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
            <CardTitle className="text-2xl font-semibold text-white">
              {t.weather.locationName[langKey]}
            </CardTitle>
            <CardDescription className="text-sm text-white/80">
              {t.weather.headline[langKey]}
            </CardDescription>
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-white/70">
            {t.weather.live[langKey]}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        {state.isLoading ? (
          <div className="text-sm text-white/80">{t.weather.loading[langKey]}</div>
        ) : state.error ? (
          <div className="text-sm text-white/80">{state.error}</div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between -mt-2">
              <div className="text-6xl font-light leading-none text-white">
                {state.temperature?.toFixed(0)}°
              </div>
              <div className="text-sm text-white/80">
                {state.condition ?? t.weather.unknown[langKey]}
              </div>
            </div>

            {state.hourly?.length ? (
              <div className="rounded-2xl border border-white/20 bg-white/10 px-3 py-3">
                <TemperatureLineChart points={state.hourly} locale={langKey} />
              </div>
            ) : null}

            <div className="flex items-center justify-between text-xs text-white/80">
              <span>
                {t.weather.windLabel[langKey]}: {state.wind?.toFixed(0)} km/h
              </span>
              {state.wind && state.wind > 30 ? (
                <span className="text-white">{t.weather.stormWarning[langKey]}</span>
              ) : (
                <span className="text-white">{t.weather.calm[langKey]}</span>
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
  locale,
}: {
  points: { time: string; temp: number }[]
  locale: "de" | "en" | "it" | "fr"
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

  const localeMap: Record<typeof locale, string> = {
    de: "de-CH",
    en: "en-US",
    it: "it-IT",
    fr: "fr-FR",
  }

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
          {new Date(p.time).toLocaleTimeString(localeMap[locale], {
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
