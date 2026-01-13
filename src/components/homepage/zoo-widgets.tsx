// src/components/homepage/zoo-widgets.tsx
import * as React from "react"
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
        "h-9 w-full rounded-md bg-white text-black hover:bg-white/90",
        "shadow-sm"
      )}
      onClick={href ? undefined : onCtaClick}
    >
      {ctaLabel}
    </Button>
  )

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "shadow-[0_10px_20px_rgba(0,0,0,0.18)]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(0,0,0,0.22)]",
        className
      )}
    >
      {/* Image */}
      <div className={cn("relative w-full", imageHeightClassName)}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className={cn(
            "h-full w-full object-cover",
            "transition-transform duration-300 group-hover:scale-[1.05]"
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        <div className="pointer-events-none absolute left-3 top-3">
          <div className="text-base font-semibold leading-tight text-white drop-shadow">
            {title}
          </div>
          {subtitle ? <div className="mt-1 text-xs text-white/80 drop-shadow">{subtitle}</div> : null}
        </div>
      </div>

      {/* CTA footer like screenshot */}
      <div className="bg-white p-0">
        <div className="px-2 pb-2">
          <div className="rounded-lg bg-black/85 p-1">
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
  description = "Some text about whats new in the zoo.",
  actions = [
    {
      title: "Tickets Kaufen",
      subtitle: "Optional subtitle",
      imageSrc:
        "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80",
      ctaLabel: "Tickets Kaufen",
      href: "/tickets",
    },
    {
      title: "Anreise Planen",
      imageSrc:
        "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80",
      ctaLabel: "Anreise Planen",
      href: "/anreise",
    },
  ],
  className,
}: ZooVisitPlannerWidgetProps) {
  return (
    <Card
      className={cn(
        "w-[520px] rounded-2xl border-black/5 bg-white/95",
        "shadow-[0_18px_50px_rgba(0,0,0,0.18)]",
        className
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
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
              href={a.href}
              onCtaClick={a.onCtaClick}
              imageHeightClassName="h-28"
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
  description = "Some test about whats new in the zoo.",
  items = [
    {
      title: "New feeding time",
      subtitle: "Short teaser text goes here",
      imageSrc:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      ctaLabel: "View Page",
      href: "/news/feeding-time",
    },
    {
      title: "Baby animals",
      subtitle: "Short teaser text goes here",
      imageSrc:
        "https://images.unsplash.com/photo-1501706362039-c6b2a7a4b9a0?auto=format&fit=crop&w=1200&q=80",
      ctaLabel: "View Page",
      href: "/news/baby-animals",
    },
    {
      title: "New enclosure",
      subtitle: "Short teaser text goes here",
      imageSrc:
        "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=1200&q=80",
      ctaLabel: "View Page",
      href: "/news/new-enclosure",
    },
  ],
  className,
}: WhatsNewWidgetProps) {
  return (
    <Card
      className={cn(
        "w-[620px] rounded-2xl border-black/5 bg-white/95",
        "shadow-[0_18px_50px_rgba(0,0,0,0.18)]",
        className
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
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
              href={it.href}
              onCtaClick={it.onCtaClick}
              imageHeightClassName="h-28"
            />
          ))}
        </div>
      </CardContent>
    </Card>
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
