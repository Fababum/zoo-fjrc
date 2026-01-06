import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import LoadArticle from "./loadArticle";

interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  emoji: string;
}

const articles: Article[] = [
  {
    id: "elephant",
    title: "Elefanten – Die sanften Riesen der Erde",
    description: "Elefanten gehören zu den beeindruckendsten Lebewesen unseres Planeten. Mit ihrer enormen Größe, ihrer hohen Intelligenz und ihrem ausgeprägten Sozialverhalten faszinieren sie Menschen seit Jahrtausenden.",
    image: "/Serengeti_Elefantenherde1.png",
    emoji: "🐘",
  },
  {
    id: "fuchs",
    title: "Füchse – Die cleveren Anpassungskünstler",
    description: "Füchse faszinieren uns, weil sie so unglaublich anpassungsfähig sind: Sie leben in Wäldern und Feldern, in Gebirgen, in der Steppe – und manche Arten kommen sogar erstaunlich gut in der Nähe von Menschen zurecht.",
    image: "/Fuchs.png",
    emoji: "🦊",
  },
];

function ArticleOverview() {
  const navigate = useNavigate();

  const handleArticleClick = (articleId: string) => {
    navigate(`/articles/${articleId}`);
  };

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