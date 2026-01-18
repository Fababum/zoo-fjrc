import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { TranslationsContext } from "../TranslationsContext"

type TranslatedArticle = {
  title: Record<"de" | "en" | "it" | "fr", string>
  subtitle: Record<"de" | "en" | "it" | "fr", string>
  image: string
  body: Record<"de" | "en" | "it" | "fr", string[]>
  highlights?: Record<"de" | "en" | "it" | "fr", string[]>
  tip?: Record<"de" | "en" | "it" | "fr", string>
}

export default function NewsArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const context = React.useContext(TranslationsContext)
  if (!context) return null

  const { translations, lang } = context
  const t = translations.newsArticlePage
  const langKey = lang as keyof typeof t.ui.newsLabel

  const articles = t.articles as Record<string, TranslatedArticle>
  const article = slug ? articles?.[slug] : undefined

  if (!article) {
    return (
      <div
        className="min-h-screen px-4 py-12 flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255, 248, 235, 0.92), rgba(255, 255, 255, 0.92)), url('/Elephant.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center">
          <div className="text-xl font-semibold text-slate-900">
            {t.ui.notFoundTitle[langKey]}
          </div>
          <p className="text-sm text-slate-600 mt-2">
            {t.ui.notFoundSubtitle[langKey]}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-full"
            onClick={() => navigate("/")}
          >
            {t.ui.backHome[langKey]}
          </Button>
        </div>
      </div>
    )
  }

  const title = article.title[langKey]
  const subtitle = article.subtitle[langKey]
  const body = article.body[langKey] ?? []
  const highlights = article.highlights?.[langKey] ?? []
  const tip =
    article.tip?.[langKey] ?? t.ui.defaultTip[langKey]

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(255, 248, 235, 0.92), rgba(255, 255, 255, 0.92)), url('/Elephant.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-xs tracking-[0.3em] uppercase text-amber-800 font-semibold">
            {t.ui.newsLabel[langKey]}
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 mt-2">
            {title}
          </h1>
          <p className="text-base text-slate-600 mt-2">{subtitle}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="bg-white text-slate-900 border border-amber-100/70 rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-64 w-full overflow-hidden">
              <img
                src={article.image}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8 space-y-4 text-sm leading-6 text-slate-700">
              {body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-100/70 bg-white/90 shadow-lg p-6">
              <div className="text-xs tracking-[0.3em] uppercase text-amber-800 font-semibold">
                {t.ui.highlightsLabel[langKey]}
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-amber-100/70 bg-amber-50 px-4 py-3"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100/70 bg-white/90 shadow-lg p-6">
              <div className="text-xs tracking-[0.3em] uppercase text-amber-800 font-semibold">
                {t.ui.tipLabel[langKey]}
              </div>
              <p className="mt-3 text-sm text-slate-700">{tip}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => navigate("/")}
          >
            {t.ui.backHome[langKey]}
          </Button>
        </div>
      </div>
    </div>
  )
}
