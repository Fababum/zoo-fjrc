import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import LoadArticle from "./loadArticle";
import { useState, useEffect } from "react";
import { getAllArtikel, type Artikel } from "../../api/artikel";

interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  emoji: string;
  markdownText?: string;
}

function ArticleOverview() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await getAllArtikel();
        
        // Transform API data to Article format
        const transformedArticles = data
          .filter(artikel => artikel.isActive)
          .map((artikel) => ({
            id: artikel.id.toString(),
            title: extractTitle(artikel.markdownText),
            description: extractDescription(artikel.markdownText),
            image: extractImage(artikel.markdownText),
            emoji: extractEmoji(artikel.markdownText),
            markdownText: artikel.markdownText,
          }));
        
        setArticles(transformedArticles);
        setError(null);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Fehler beim Laden der Artikel.');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Helper functions to extract metadata from markdown
  const extractTitle = (markdown: string): string => {
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1] : 'Unbekannter Artikel';
  };

  const extractDescription = (markdown: string): string => {
    const lines = markdown.split('\n');
    const descLine = lines.find(line => line.trim() && !line.startsWith('#'));
    return descLine ? descLine.substring(0, 150) : '';
  };

  const extractImage = (markdown: string): string => {
    const imageMatch = markdown.match(/!\[.*?\]\((.+?)\)/);
    return imageMatch ? imageMatch[1] : '/placeholder.png';
  };

  const extractEmoji = (markdown: string): string => {
    const emojiMatch = markdown.match(/([\u{1F300}-\u{1F9FF}])/u);
    return emojiMatch ? emojiMatch[1] : '📄';
  };

  const handleArticleClick = (articleId: string) => {
    const currentLang = window.location.pathname.split('/')[1];
    navigate(`/${currentLang}/articles/${articleId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Artikel werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Tier-Artikel
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Entdecke faszinierende Geschichten und Fakten über verschiedene Tierarten
          </p>
          {error && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
              {error}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleArticleClick(article.id)}
            >
              <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                <div className="absolute top-4 right-4 text-5xl">
                  {article.emoji}
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {article.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300 line-clamp-3">
                  {article.description}
                </CardDescription>
              </CardContent>

              <CardFooter>
                <Button
                  variant="default"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArticleClick(article.id);
                  }}
                >
                  Mehr lesen →
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Articles()  {
  const { article } = useParams<{ article?: string }>();

  return (
    <div>
      {article ? <LoadArticle /> : <ArticleOverview />}
    </div>
  );
};

export default Articles;