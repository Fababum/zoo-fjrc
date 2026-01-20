import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import LoadArticle from "./loadArticle";
import { useState, useEffect, useContext } from "react";
import { getAllArtikel, createArtikel } from "../../api/artikel";
import type { Artikel } from "../../api/artikel";
import { Plus, X } from "lucide-react";
import { TranslationsContext } from "../TranslationsContext";

const SUPPORTED_LANGS = ["de", "en", "fr", "it"] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const isSupportedLang = (value?: string): value is SupportedLang => {
  return !!value && (SUPPORTED_LANGS as readonly string[]).includes(value);
};

const resolveLang = (contextLang?: string, routeLang?: string): SupportedLang => {
  if (isSupportedLang(contextLang)) return contextLang;
  if (isSupportedLang(routeLang)) return routeLang;
  return "de";
};

const resolveMarkdown = (artikel: Artikel, lang: SupportedLang): string => {
  const candidates: Array<string | undefined> = [
    lang === "de" ? artikel.markdownTextDe : undefined,
    lang === "en" ? artikel.markdownTextEn : undefined,
    lang === "fr" ? artikel.markdownTextFr : undefined,
    lang === "it" ? artikel.markdownTextIt : undefined,
    artikel.markdownText,
    artikel.markdownTextDe,
    artikel.markdownTextEn,
    artikel.markdownTextFr,
    artikel.markdownTextIt,
  ];

  return candidates.find((text) => text && text.trim()) ?? "";
};

function ArticleOverview() {
  const navigate = useNavigate();
  const { lang: routeLang } = useParams<{ lang?: string }>();
  const context = useContext(TranslationsContext);
  const activeLang = resolveLang(context?.lang, routeLang);
  const t = {
    loading: {
      de: "Artikel werden geladen...",
      en: "Loading articles...",
      fr: "Chargement des articles...",
      it: "Caricamento articoli...",
    },
    header: {
      de: "Tier-Artikel",
      en: "Animal articles",
      fr: "Articles animaux",
      it: "Articoli sugli animali",
    },
    newArticle: {
      de: "Neuer Artikel",
      en: "New article",
      fr: "Nouvel article",
      it: "Nuovo articolo",
    },
    description: {
      de: "Entdecke faszinierende Geschichten und Fakten ueber verschiedene Tierarten",
      en: "Discover fascinating stories and facts about different species",
      fr: "Decouvrez des histoires fascinantes et des faits sur differentes especes",
      it: "Scopri storie e fatti su diverse specie",
    },
    errorLoad: {
      de: "Fehler beim Laden der Artikel.",
      en: "Failed to load articles.",
      fr: "Impossible de charger les articles.",
      it: "Impossibile caricare gli articoli.",
    },
    errorCreate: {
      de: "Fehler beim Erstellen des Artikels.",
      en: "Failed to create article.",
      fr: "Impossible de creer l'article.",
      it: "Impossibile creare l'articolo.",
    },
    readMore: {
      de: "Mehr lesen",
      en: "Read more",
      fr: "Lire la suite",
      it: "Leggi di piu",
    },
    modalTitle: {
      de: "Neuer Artikel",
      en: "New article",
      fr: "Nouvel article",
      it: "Nuovo articolo",
    },
    modalSubtitle: {
      de: "Fuege Titel, Text und optional ein Bild hinzu.",
      en: "Add a title, text, and an optional image.",
      fr: "Ajoutez un titre, du texte et une image optionnelle.",
      it: "Aggiungi un titolo, testo e un'immagine opzionale.",
    },
    modalCloseAria: {
      de: "Modal schliessen",
      en: "Close modal",
      fr: "Fermer la fenetre",
      it: "Chiudi finestra",
    },
    contentLabel: {
      de: "Inhalt (Markdown)",
      en: "Content (Markdown)",
      fr: "Contenu (Markdown)",
      it: "Contenuto (Markdown)",
    },
    placeholder: {
      de: "# Titel des Artikels\n\nKurze Einleitung...\n\n![Bildbeschreibung](https://...)\n\n## Abschnitt\nText...",
      en: "# Article title\n\nShort intro...\n\n![Image description](https://...)\n\n## Section\nText...",
      fr: "# Titre de l'article\n\nCourte introduction...\n\n![Description de l'image](https://...)\n\n## Section\nTexte...",
      it: "# Titolo dell'articolo\n\nBreve introduzione...\n\n![Descrizione immagine](https://...)\n\n## Sezione\nTesto...",
    },
    tip: {
      de: "Tipp: Starte mit # Titel. Bilder: ![Bild](url). Maximal 2-3 kurze Abschnitte.",
      en: "Tip: Start with # Title. Images: ![Image](url). Keep it to 2-3 short sections.",
      fr: "Astuce : Commencez par # Titre. Images : ![Image](url). 2-3 sections courtes.",
      it: "Suggerimento: inizia con # Titolo. Immagini: ![Immagine](url). 2-3 sezioni brevi.",
    },
    templateButton: {
      de: "Vorlage einfuegen",
      en: "Insert template",
      fr: "Inserer un modele",
      it: "Inserisci modello",
    },
    templateContent: {
      de: "# Titel des Artikels\n\nKurze Einleitung...\n\n## Abschnitt\nText...\n",
      en: "# Article title\n\nShort intro...\n\n## Section\nText...\n",
      fr: "# Titre de l'article\n\nCourte introduction...\n\n## Section\nTexte...\n",
      it: "# Titolo dell'articolo\n\nBreve introduzione...\n\n## Sezione\nTesto...\n",
    },
    imageButton: {
      de: "Bild-Platzhalter",
      en: "Image placeholder",
      fr: "Espace image",
      it: "Segnaposto immagine",
    },
    imagePlaceholder: {
      de: "![Bildbeschreibung](https://...)",
      en: "![Image description](https://...)",
      fr: "![Description de l'image](https://...)",
      it: "![Descrizione immagine](https://...)",
    },
    cancel: { de: "Abbrechen", en: "Cancel", fr: "Annuler", it: "Annulla" },
    create: {
      de: "Artikel erstellen",
      en: "Create article",
      fr: "Creer l'article",
      it: "Crea articolo",
    },
    creating: {
      de: "Erstelle...",
      en: "Creating...",
      fr: "Creation...",
      it: "Creazione...",
    },
    unknownArticle: {
      de: "Unbekannter Artikel",
      en: "Unknown article",
      fr: "Article inconnu",
      it: "Articolo sconosciuto",
    },
  } as const;
  const [articles, setArticles] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [markdownInput, setMarkdownInput] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await getAllArtikel();
        setArticles(data.filter((artikel) => artikel.isActive));
        setError(null);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError(t.errorLoad[activeLang]);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const extractTitle = (markdown: string): string => {
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1] : t.unknownArticle[activeLang];
  };

  const extractDescription = (markdown: string): string => {
    const lines = markdown.split("\n").filter((line) => line.trim());
    for (const line of lines) {
      if (!line.startsWith("#") && !line.startsWith("![") && line.length > 20) {
        return line.substring(0, 200) + (line.length > 200 ? "..." : "");
      }
    }
    return "";
  };

  const extractImage = (markdown: string): string => {
    const imageMatch = markdown.match(/!\[.*?\]\((.+?)\)/);
    if (imageMatch) {
      return imageMatch[1];
    }
    return getRandomImage();
  };

  const getRandomImage = (): string => {
    const images = [
      "/Elephant.png",
      "/ElephantSquare.png",
      "/Fuchs.png",
      "/leu.png",
      "/Serengeti_Elefantenherde1.png",
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const handleArticleClick = (articleId: string) => {
    navigate(`/${activeLang}/articles/${articleId}`);
  };

  const handleCreateArticle = async () => {
    if (!markdownInput.trim()) return;

    try {
      setCreating(true);

      await createArtikel({
        markdownText: markdownInput,
        userId: 1,
      });

      const data = await getAllArtikel();
      setArticles(data.filter((artikel) => artikel.isActive));
      setShowCreateModal(false);
      setMarkdownInput("");
    } catch (err) {
      console.error("Error creating article:", err);
      setError(t.errorCreate[activeLang]);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">{t.loading[activeLang]}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(255, 248, 235, 0.92), rgba(255, 255, 255, 0.92)), url('/Elephant.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center gap-4 mb-6 sm:flex-row">
            <h1 className="text-4xl font-semibold text-slate-900">{t.header[activeLang]}</h1>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="gap-2 rounded-full"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              {t.newArticle[activeLang]}
            </Button>
          </div>
          <p className="text-base text-slate-600">{t.description[activeLang]}</p>
          {error && <p className="text-sm text-amber-600 mt-2">{error}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => {
            const markdown = resolveMarkdown(article, activeLang);

            return (
              <Card
                key={article.id}
                className="overflow-hidden border border-amber-100/70 bg-white/80 shadow-lg backdrop-blur transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
                onClick={() => handleArticleClick(article.id.toString())}
              >
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  <img
                    src={extractImage(markdown)}
                    alt={extractTitle(markdown)}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>

                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    {extractTitle(markdown)}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-slate-600 line-clamp-3">
                    {extractDescription(markdown)}
                  </CardDescription>
                </CardContent>

                <CardFooter>
                  <Button
                    variant="default"
                    className="w-full rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArticleClick(article.id.toString());
                    }}
                  >
                    {t.readMore[activeLang]}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {showCreateModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(255, 248, 235, 0.95), rgba(255, 255, 255, 0.95)), url('/ElephantSquare.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-amber-100/70">
            <div className="flex items-start justify-between gap-4 p-6 border-b border-amber-100/70 sticky top-0 bg-white/90 backdrop-blur">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {t.modalTitle[activeLang]}
                </h2>
                <p className="text-sm text-slate-600 mt-1">{t.modalSubtitle[activeLang]}</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-500 hover:text-slate-700"
                aria-label={t.modalCloseAria[activeLang]}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.contentLabel[activeLang]}
                </label>
                <textarea
                  value={markdownInput}
                  onChange={(e) => setMarkdownInput(e.target.value)}
                  placeholder={t.placeholder[activeLang]}
                  className="w-full h-64 p-4 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-200 font-mono text-sm shadow-sm"
                />
                <div className="mt-2 text-xs text-slate-500">{t.tip[activeLang]}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() =>
                      setMarkdownInput(
                        (prev) =>
                          prev || t.templateContent[activeLang]
                      )
                    }
                  >
                    {t.templateButton[activeLang]}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() =>
                      setMarkdownInput((prev) => `${prev}

${t.imagePlaceholder[activeLang]}`)
                    }
                  >
                    {t.imageButton[activeLang]}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 justify-end pt-4 border-t border-amber-100/70 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-full"
                >
                  {t.cancel[activeLang]}
                </Button>
                <Button
                  onClick={handleCreateArticle}
                  disabled={creating || !markdownInput.trim()}
                  className="rounded-full"
                >
                  {creating ? t.creating[activeLang] : t.create[activeLang]}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Articles() {
  const { article } = useParams<{ article?: string }>();

  return <div>{article ? <LoadArticle /> : <ArticleOverview />}</div>;
}

export default Articles;
