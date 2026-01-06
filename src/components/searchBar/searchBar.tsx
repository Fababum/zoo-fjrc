import { Search } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"

const searchablePages = [
  { name: "Home", path: "/", keywords: ["home", "start", "main"] },
  { name: "Login", path: "/login", keywords: ["login", "sign in", "signin"] },
  { name: "Create Account", path: "/create-account", keywords: ["signup", "sign up", "register", "create account"] },
  { name: "Sign Up", path: "/signUp", keywords: ["signup", "sign up", "register"] },
  { name: "Sign In", path: "/signIn", keywords: ["login", "sign in", "signin"] },
  { name: "Sign Up Confirmation", path: "/signUpConfirmation", keywords: ["confirmation", "verify"] },
  { name: "Articles", path: "/articles", keywords: ["articles", "news", "blog", "posts"] },
  { name: "QR Code", path: "/qr-code", keywords: ["qr", "code", "ticket", "scan"] },
  { name: "Map", path: "/map", keywords: ["map", "location", "directions"] },
  { name: "Log out", path: "/logout", keywords: ["logout", "log out", "signout"] },
]

const articleContent = [
  { 
    name: "Article: Füchse", 
    path: "/articles/fuchs", 
    keywords: ["fuchs", "füchse", "fox", "rotfuchs", "polarfuchs", "vulpes", "raubtier", "canidae", "hunde", "clever", "anpassungskünstler", "wald", "felder", "gebirge"] 
  },
  { 
    name: "Article: Elefanten", 
    path: "/articles/elephant", 
    keywords: ["elefant", "elefanten", "elephant", "afrikanischer elefant", "asiatischer elefant", "savannenelefant", "waldelefant", "riesen", "rüssel", "stoßzähne", "intelligenz", "sozialverhalten"] 
  },
]

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()

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
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-9 h-10 w-64 border-gray-100 bg-white/90 shadow-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      
      {showSuggestions && filteredPages.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-md border border-gray-100 shadow-lg max-h-60 overflow-y-auto z-50">
          {filteredPages.map((page) => (
            <button
              key={page.path}
              onClick={() => handleSelectPage(page.path)}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
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
