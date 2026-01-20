import { Search } from "lucide-react"
import { useState, useContext, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { TranslationsContext } from "../TranslationsContext"

const SUPPORTED_LANGS = ["de", "en", "fr", "it"] as const
type SupportedLang = (typeof SUPPORTED_LANGS)[number]

const resolveLang = (contextLang?: string, routeLang?: string): SupportedLang => {
  if ((SUPPORTED_LANGS as readonly string[]).includes(contextLang ?? "")) {
    return contextLang as SupportedLang
  }
  if ((SUPPORTED_LANGS as readonly string[]).includes(routeLang ?? "")) {
    return routeLang as SupportedLang
  }
  return "de"
}

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()
  const context = useContext(TranslationsContext)
  const { lang: routeLang } = useParams<{ lang?: string }>()
  const activeLang = resolveLang(context?.lang, routeLang)

  const t = {
    placeholder: {
      de: "Suchen...",
      en: "Search...",
      fr: "Rechercher...",
      it: "Cerca...",
    },
    pages: {
      home: { de: "Home", en: "Home", fr: "Accueil", it: "Home" },
      signIn: { de: "Anmelden", en: "Sign in", fr: "Se connecter", it: "Accedi" },
      signUp: { de: "Registrieren", en: "Sign up", fr: "S'inscrire", it: "Registrati" },
      signUpConfirmation: {
        de: "Registrierung bestaetigt",
        en: "Sign up confirmation",
        fr: "Confirmation d'inscription",
        it: "Conferma registrazione",
      },
      articles: { de: "Artikel", en: "Articles", fr: "Articles", it: "Articoli" },
      map: { de: "Karte", en: "Map", fr: "Carte", it: "Mappa" },
      chatbot: { de: "Chatbot", en: "Chatbot", fr: "Chatbot", it: "Chatbot" },
      purchaseTickets: {
        de: "Tickets kaufen",
        en: "Buy tickets",
        fr: "Acheter des billets",
        it: "Acquista biglietti",
      },
      orders: { de: "Bestellungen", en: "Orders", fr: "Commandes", it: "Ordini" },
    },
    articleNames: {
      fox: { de: "Artikel: Fuechse", en: "Article: Foxes", fr: "Article : Renards", it: "Articolo: Volpi" },
      elephant: {
        de: "Artikel: Elefanten",
        en: "Article: Elephants",
        fr: "Article : Elephants",
        it: "Articolo: Elefanti",
      },
    },
  } as const

  const buildPath = (path: string) => {
    if (path == "/") return `/${activeLang}`
    return `/${activeLang}${path}`
  }

  const searchablePages = useMemo(
    () => [
      { name: t.pages.home[activeLang], path: buildPath("/"), keywords: ["home", "start", "main", "zoo"] },
      {
        name: t.pages.signIn[activeLang],
        path: buildPath("/signIn"),
        keywords: ["login", "sign in", "signin", "anmelden"],
      },
      {
        name: t.pages.signUp[activeLang],
        path: buildPath("/signUp"),
        keywords: ["signup", "sign up", "register", "registrieren"],
      },
      {
        name: t.pages.signUpConfirmation[activeLang],
        path: buildPath("/signUpConfirmation"),
        keywords: ["confirmation", "verify", "bestaetigung"],
      },
      {
        name: t.pages.articles[activeLang],
        path: buildPath("/articles"),
        keywords: ["articles", "news", "blog", "posts"],
      },
      {
        name: t.pages.map[activeLang],
        path: buildPath("/map"),
        keywords: ["map", "location", "directions", "karte"],
      },
      {
        name: t.pages.chatbot[activeLang],
        path: buildPath("/chatbot"),
        keywords: ["chat", "assistant", "bot"],
      },
      {
        name: t.pages.purchaseTickets[activeLang],
        path: buildPath("/purchaseTickets"),
        keywords: ["tickets", "buy", "kaufen", "billets", "biglietti"],
      },
      {
        name: t.pages.orders[activeLang],
        path: buildPath("/orders"),
        keywords: ["orders", "bestellungen", "commandes", "ordini"],
      },
    ],
    [activeLang]
  )

  const articleContent = useMemo(
    () => [
      {
        name: t.articleNames.fox[activeLang],
        path: buildPath("/articles/fuchs"),
        keywords: ["fuchs", "fox", "renard", "volpe"],
      },
      {
        name: t.articleNames.elephant[activeLang],
        path: buildPath("/articles/elephant"),
        keywords: ["elefant", "elephant", "elephant", "elefante"],
      },
    ],
    [activeLang]
  )

  const filteredPages = searchQuery.trim()
    ? [...searchablePages, ...articleContent].filter((page) =>
        page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.keywords.some((keyword) => keyword.includes(searchQuery.toLowerCase()))
      )
    : []

  const handleSelectPage = (path: string) => {
    navigate(path)
    setSearchQuery("")
    setShowSuggestions(false)
  }

  return (
    <div className="relative flex items-center h-10">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="search"
        placeholder={t.placeholder[activeLang]}
        className="h-10 w-64 rounded-full border border-amber-100 bg-white/90 pl-9 shadow-sm transition hover:shadow-md focus-visible:ring-1 focus-visible:ring-amber-200"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      
      {showSuggestions && filteredPages.length > 0 && (
        <div className="absolute top-full mt-1 w-full rounded-xl border border-amber-100 bg-white shadow-lg max-h-60 overflow-y-auto z-50">
          {filteredPages.map((page) => (
            <button
              key={page.path}
              onClick={() => handleSelectPage(page.path)}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-amber-50 first:rounded-t-xl last:rounded-b-xl"
            >
              {page.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
