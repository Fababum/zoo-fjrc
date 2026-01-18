import { NavLink, useParams, useNavigate } from "react-router-dom"
import { Menu } from "lucide-react"
import { useContext, useEffect } from "react"
import { TranslationsContext } from "../TranslationsContext"
import { useAuth } from "../AuthContext"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import SearchBar from "../searchBar/searchBar"

const SUPPORTED_LANGS = ["de", "en", "fr", "it"] as const
type SupportedLang = (typeof SUPPORTED_LANGS)[number]

function isSupportedLang(value?: string): value is SupportedLang {
  return !!value && (SUPPORTED_LANGS as readonly string[]).includes(value)
}

function NavBar() {
  const { lang } = useParams<{ lang?: string }>()
  const navigate = useNavigate()
  const context = useContext(TranslationsContext)
  const { isLoggedIn, logout } = useAuth()

  if (!context) return null

  const { translations } = context
  const ui = translations.navbar
  const langKey = (context.lang ?? (isSupportedLang(lang) ? lang : "de")) as keyof typeof ui.menuLabel

  // Source of truth: Context -> fallback URL -> fallback "de"
  const activeLang: SupportedLang =
    (context.lang && isSupportedLang(context.lang) ? context.lang : undefined) ??
    (isSupportedLang(lang) ? lang : undefined) ??
    "de"

  // Sync Context when URL param changes
  useEffect(() => {
    if (!context) return
    if (isSupportedLang(lang) && context.lang !== lang) {
      context.setLang(lang)
    }
  }, [lang, context])

  const changeLanguage = (newLang: SupportedLang) => {
    context.setLang(newLang)

    const currentPath = window.location.pathname
    const hasLangPrefix = /^\/(de|en|fr|it)(\/|$)/.test(currentPath)
    const pathWithoutLang = currentPath.replace(/^\/(de|en|fr|it)(?=\/|$)/, "")

    navigate(hasLangPrefix ? `/${newLang}${pathWithoutLang}` : `/${newLang}${currentPath}`)
  }

  return (
    <div className="fixed top-8 left-8 right-8 flex items-center justify-between gap-3 z-50">
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full border border-amber-100 bg-white/90 shadow-sm transition hover:shadow-md"
              aria-label={ui.openMenuAria?.[langKey] ?? "Open menu"}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={8}
            className="min-w-[220px] p-2 bg-white rounded-lg shadow-lg border border-gray-100"
          >
            <DropdownMenuLabel className="px-2 pb-1 text-xs text-gray-500">
              {ui.menuLabel[langKey]}
            </DropdownMenuLabel>

            <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <NavLink to={`/${activeLang}`}>{ui.home[langKey]}</NavLink>
            </DropdownMenuItem>

            {!isLoggedIn && (
              <>
                <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  <NavLink to={`/${activeLang}/signIn`}>{ui.signIn[langKey]}</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  <NavLink to={`/${activeLang}/signUp`}>{ui.signUp[langKey]}</NavLink>
                </DropdownMenuItem>
              </>
            )}

            {isLoggedIn && (
              <>
                <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  <NavLink to={`/${activeLang}/map`}>{ui.map[langKey]}</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  <NavLink to={`/${activeLang}/articles`}>{ui.articles[langKey]}</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  <NavLink to={`/${activeLang}/chatbot`}>{ui.chatbot[langKey]}</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  <NavLink to={`/${activeLang}/purchaseTickets`}>{ui.purchaseTickets[langKey]}</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  <NavLink to={`/${activeLang}/orders`}>{ui.orders[langKey]}</NavLink>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center justify-between">
                {ui.language[langKey]}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-36 p-1 bg-white rounded-md border border-gray-100 shadow-md">
                <DropdownMenuItem
                  onClick={() => changeLanguage("fr")}
                  className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  {ui.langNames.fr[langKey]}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => changeLanguage("de")}
                  className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  {ui.langNames.de[langKey]}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => changeLanguage("en")}
                  className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  {ui.langNames.en[langKey]}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => changeLanguage("it")}
                  className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  {ui.langNames.it[langKey]}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            {isLoggedIn && (
              <DropdownMenuItem
                onClick={() => logout()}
                className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
              >
                {ui.logout[langKey]}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <SearchBar />
      </div>

      <NavLink
        to={`/${activeLang}`}
        className="inline-flex h-10 items-center rounded-full border border-amber-100 bg-white/90 px-5 text-xs font-semibold tracking-[0.3em] text-amber-800 shadow-sm transition hover:shadow-md"
      >
        {ui.brand[langKey]}
      </NavLink>
    </div>
  )
}

export default NavBar
