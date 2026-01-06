import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "./loadArticle.css";
import "github-markdown-css/github-markdown.css";

type ArticleKey = "fuchs" | "elephant";

const articleLoaders: Record<ArticleKey, () => Promise<{ default: string }>> = {
  fuchs: () => import("./fuchs_article.md?raw"),
  elephant: () => import("./elefanten_artikel.md?raw"),
};

export default function LoadArticle() {
  const { article } = useParams<{ article?: string }>();
  const key = (article?.toLowerCase()) as ArticleKey;

  const [content, setContent] = useState("");

  useEffect(() => {
    const loader = articleLoaders[key] ?? articleLoaders.fuchs;
    loader().then((m) => setContent(m.default));
  }, [key]);

  return (
    <main className="page">
      <article className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ alt, ...props }) => {
              const [text, size] = (alt ?? "").split("|");

              const sizes: Record<string, string> = {
                small: "300px",
                medium: "500px",
                large: "800px",
              };

              return (
                <img
                  {...props}
                  alt={text}
                  style={{
                    maxWidth: sizes[size ?? "medium"] ?? "500px",
                    width: "100%",
                    height: "auto",
                    display: "block",
                    margin: "1.5rem auto",
                    borderRadius: "12px",
                  }}
                />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
