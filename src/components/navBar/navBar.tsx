import { NavLink, useParams, useNavigate } from "react-router-dom"
import { Menu } from "lucide-react"
import { useContext } from "react"
import { TranslationsContext } from "../TranslationsContext"

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

function NavBar() {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'de';
  const navigate = useNavigate();
  const context = useContext(TranslationsContext);

  const changeLanguage = (newLang: string) => {
    if (context) {
      context.setLang(newLang);
    }
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(de|en|fr|it)/, '');
    navigate(`/${newLang}${pathWithoutLang || ''}`);
  };

  return (
    <div className="fixed top-8 left-8 flex items-center gap-3 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-md border border-gray-100 bg-white/90 shadow-sm"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="min-w-[220px] p-2 bg-white rounded-lg shadow-lg border border-gray-100"
        >
          <DropdownMenuLabel className="px-2 pb-1 text-xs text-gray-500">Menu</DropdownMenuLabel>

          <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <NavLink to={`/${currentLang}/signIn`}>Sign In</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <NavLink to={`/${currentLang}/signUp`}>Sign Up</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <NavLink to={`/${currentLang}/qr-code`}>QR Code</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <NavLink to={`/${currentLang}/map`}>Map</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <NavLink to={`/${currentLang}/articles`}>Articles</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <NavLink to={`/${currentLang}/chatbot`}>Chatbot</NavLink>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center justify-between">
              Language
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-36 p-1 bg-white rounded-md border border-gray-100 shadow-md">
              <DropdownMenuItem onClick={() => changeLanguage('fr')} className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">French</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('de')} className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">German</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('en')} className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('it')} className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">Italian</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className="px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <NavLink to={`/${currentLang}/logout`}>Log out</NavLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SearchBar />
    </div>
  )
}

export default NavBar
