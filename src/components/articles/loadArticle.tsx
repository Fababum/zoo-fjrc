import { useEffect, useState, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArtikelById, updateArtikel, deleteArtikel } from "../../api/artikel";
import type { Artikel } from "../../api/artikel";
import { Button } from "../ui/button";
import { Edit, Trash2, X, Save, ArrowLeft } from "lucide-react";
import { TranslationsContext } from "../TranslationsContext";

import "./loadArticle.css";
import "github-markdown-css/github-markdown.css";

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

const updateMarkdownForLang = (
  artikel: Artikel | null,
  lang: SupportedLang,
  text: string
): Artikel | null => {
  if (!artikel) return artikel;
  const updated = { ...artikel, markdownText: text };

  if (lang === "de") updated.markdownTextDe = text;
  if (lang === "en") updated.markdownTextEn = text;
  if (lang === "fr") updated.markdownTextFr = text;
  if (lang === "it") updated.markdownTextIt = text;

  return updated;
};

export default function LoadArticle() {
  const { article, lang: routeLang } = useParams<{ article?: string; lang?: string }>();
  const navigate = useNavigate();
  const context = useContext(TranslationsContext);
  const activeLang = resolveLang(context?.lang, routeLang);
  const [articleData, setArticleData] = useState<Artikel | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  const t = {
    loading: { de: "Artikel wird geladen...", en: "Loading article...", fr: "Chargement de l'article...", it: "Caricamento articolo..." },
    error: { de: "Artikel konnte nicht geladen werden.", en: "Article could not be loaded.", fr: "Impossible de charger l'article.", it: "Impossibile caricare l'articolo." },
    edit: { de: "Bearbeiten", en: "Edit", fr: "Editer", it: "Modifica" },
    delete: { de: "Loeschen", en: "Delete", fr: "Supprimer", it: "Elimina" },
    save: { de: "Speichern", en: "Save", fr: "Enregistrer", it: "Salva" },
    saving: { de: "Speichert...", en: "Saving...", fr: "Enregistrement...", it: "Salvataggio..." },
    cancel: { de: "Abbrechen", en: "Cancel", fr: "Annuler", it: "Annulla" },
    editTitle: { de: "Artikel bearbeiten", en: "Edit article", fr: "Editer l'article", it: "Modifica articolo" },
    back: { de: "Zurueck zur Uebersicht", en: "Back to overview", fr: "Retour a la liste", it: "Torna alla lista" },
    deleteConfirm: { de: "Moechten Sie diesen Artikel wirklich loeschen?", en: "Do you really want to delete this article?", fr: "Voulez-vous vraiment supprimer cet article ?", it: "Vuoi davvero eliminare questo articolo?" },
    saveError: { de: "Fehler beim Speichern des Artikels", en: "Error saving the article", fr: "Erreur lors de l'enregistrement", it: "Errore durante il salvataggio" },
    deleteError: { de: "Fehler beim Loeschen des Artikels", en: "Error deleting the article", fr: "Erreur lors de la suppression", it: "Errore durante l'eliminazione" },
  } as const;

  const resolvedMarkdown = useMemo(() => {
    if (!articleData) return "";
    return resolveMarkdown(articleData, activeLang);
  }, [articleData, activeLang]);

  useEffect(() => {
    const loadArticle = async () => {
      if (!article) return;

      try {
        setLoading(true);
        const articleId = parseInt(article);
        const data = await getArtikelById(articleId);
        setArticleData(data);
        setError(null);
      } catch (err) {
        console.error("Error loading article:", err);
        setError(t.error[activeLang]);
        setContent("");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [article, activeLang]);

  useEffect(() => {
    if (!articleData || isEditing) return;
    setContent(resolvedMarkdown);
    setEditContent(resolvedMarkdown);
  }, [articleData, resolvedMarkdown, isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!article) return;

    try {
      setSaving(true);
      const articleId = parseInt(article);
      await updateArtikel(articleId, {
        markdownText: editContent,
      });
      setArticleData((prev) => updateMarkdownForLang(prev, activeLang, editContent));
      setContent(editContent);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating article:", err);
      alert(t.saveError[activeLang]);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!article) return;

    if (!confirm(t.deleteConfirm[activeLang])) {
      return;
    }

    try {
      const articleId = parseInt(article);
      await deleteArtikel(articleId);
      navigate(`/${activeLang}/articles`);
    } catch (err) {
      console.error("Error deleting article:", err);
      alert(t.deleteError[activeLang]);
    }
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate(`/${activeLang}/articles`);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-rose-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(255, 248, 235, 0.92), rgba(255, 255, 255, 0.92)), url('/Fuchs.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {!isEditing ? (
            <>
              <Button onClick={handleEdit} className="gap-2 rounded-full" size="lg">
                <Edit className="h-5 w-5" />
                {t.edit[activeLang]}
              </Button>
              <Button
                onClick={handleDelete}
                className="gap-2 rounded-full bg-rose-500 hover:bg-rose-600"
                size="lg"
              >
                <Trash2 className="h-5 w-5" />
                {t.delete[activeLang]}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} disabled={saving} className="gap-2 rounded-full" size="lg">
                <Save className="h-5 w-5" />
                {saving ? t.saving[activeLang] : t.save[activeLang]}
              </Button>
              <Button onClick={handleCancel} variant="outline" className="rounded-full" size="lg">
                <X className="h-5 w-5" />
                {t.cancel[activeLang]}
              </Button>
            </>
          )}
        </div>

        {isEditing ? (
          <div className="bg-white/80 border border-amber-100/70 rounded-lg shadow-2xl backdrop-blur p-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">{t.editTitle[activeLang]}</h2>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-[70vh] p-4 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-200 font-mono text-sm"
            />
          </div>
        ) : (
          <article className="markdown-body bg-white text-slate-900 border border-amber-100/70 rounded-lg shadow-2xl p-8">
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
        )}

        <div className="flex justify-center mt-8">
          <Button onClick={handleBack} variant="outline" className="gap-2 rounded-full" size="lg">
            <ArrowLeft className="h-5 w-5" />
            {t.back[activeLang]}
          </Button>
        </div>
      </div>
    </div>
  );
}
