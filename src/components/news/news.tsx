import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

type NewsArticle = {
  slug: string
  title: string
  subtitle: string
  image: string
  body: string[]
  highlights?: string[]
}

const newsArticles: NewsArticle[] = [
  {
    slug: "feeding-time",
    title: "Neue Fütterungszeiten",
    subtitle: "Mehr Nähe zu den Tieren – täglich live dabei.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Ab sofort finden die Fütterungen im Savannenbereich zweimal täglich statt – perfekt, um die Tiere aktiv zu erleben.",
      "Beste Zeiten: 10:30 Uhr und 15:30 Uhr. Bitte bleib hinter den Markierungen und halte Abstand.",
      "Unser Team erklärt kurz, was die Tiere fressen und warum bestimmte Futterarten wichtig sind.",
    ],
    highlights: ["10:30 & 15:30 Uhr", "Savannenbereich", "Kurzinfos vom Team"],
    tip: "Komm 10–15 Minuten früher, so bekommst du einen guten Platz.",
  },
  {
    slug: "baby-animals",
    title: "Nachwuchs im Zoo",
    subtitle: "Frischer Nachwuchs – sanfte Momente im Alltag.",
    image: "/Fuchs.png",
    body: [
      "In den letzten Wochen gab es Nachwuchs bei den Erdmännchen und Giraffen.",
      "Die Jungtiere sind besonders vormittags aktiv und bleiben gerne in der Nähe ihrer Mutter.",
      "Bitte sei besonders ruhig – die Kleinen reagieren sensibel auf laute Geräusche.",
    ],
    highlights: ["Vormittags aktiv", "Ruhige Beobachtung", "Mehrere Gehege"],
    tip: "Leise bleiben lohnt sich – so siehst du mehr von den Jungtieren.",
  },
  {
    slug: "new-enclosure",
    title: "Neues Gehege eröffnet",
    subtitle: "Mehr Raum, mehr Rückzug, bessere Sicht.",
    image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Das neue Gehege verbindet Beobachtungspunkte mit naturnaher Bepflanzung.",
      "So können sich die Tiere zurückziehen, während Besucher dennoch Einblicke erhalten.",
      "Entdecke die neuen Wege und Aussichtspunkte direkt vor Ort.",
    ],
    highlights: ["Neue Wege", "Naturnahe Pflanzen", "Mehr Rückzugsorte"],
    tip: "Plane eine kleine Runde: Der neue Bereich ist ideal für einen kurzen Abstecher.",
  },
]

export default function NewsArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const article = newsArticles.find((item) => item.slug === slug)

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
          <div className="text-xl font-semibold text-slate-900">Artikel nicht gefunden</div>
          <p className="text-sm text-slate-600 mt-2">Bitte prüfe den Link.</p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-full"
            onClick={() => navigate("/")}
          >
            Zur Homepage
          </Button>
        </div>
      </div>
    )
  }

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
            News
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 mt-2">
            {article.title}
          </h1>
          <p className="text-base text-slate-600 mt-2">{article.subtitle}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="bg-white text-slate-900 border border-amber-100/70 rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-64 w-full overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8 space-y-4 text-sm leading-6 text-slate-700">
              {article.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-100/70 bg-white/90 shadow-lg p-6">
              <div className="text-xs tracking-[0.3em] uppercase text-amber-800 font-semibold">
                Highlights
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                {(article.highlights ?? []).map((item) => (
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
                Tipp
              </div>
              <p className="mt-3 text-sm text-slate-700">
                {article.tip ??
                  "Plane deinen Besuch mit genug Zeit für die jeweiligen Bereiche – die Wege sind weit, aber lohnen sich."}
              </p>
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
            Zur Homepage
          </Button>
        </div>
      </div>
    </div>
  )
}
