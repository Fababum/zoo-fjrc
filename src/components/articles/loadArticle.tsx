import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArtikelById, updateArtikel, deleteArtikel } from "../../api/artikel";
import { Button } from "../ui/button";
import { Edit, Trash2, X, Save, ArrowLeft } from "lucide-react";

import "./loadArticle.css";
import "github-markdown-css/github-markdown.css";

export default function LoadArticle() {
  const { article } = useParams<{ article?: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      if (!article) return;

      try {
        setLoading(true);
        const articleId = parseInt(article);
        const data = await getArtikelById(articleId);
        setContent(data.markdownText);
        setEditContent(data.markdownText);
        setError(null);
      } catch (err) {
        console.error('Error loading article:', err);
        setError('Artikel konnte nicht geladen werden.');
        setContent('');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [article]);

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
      setContent(editContent);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating article:', err);
      alert('Fehler beim Speichern des Artikels');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    
    if (!confirm('Möchten Sie diesen Artikel wirklich löschen?')) {
      return;
    }

    try {
      const articleId = parseInt(article);
      await deleteArtikel(articleId);
      const currentLang = window.location.pathname.split('/')[1];
      navigate(`/${currentLang}/articles`);
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Fehler beim Löschen des Artikels');
    }
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const handleBack = () => {
    const currentLang = window.location.pathname.split('/')[1];
    navigate(`/${currentLang}/articles`);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Artikel wird geladen...</p>
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
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
        {!isEditing ? (
          <>
            <Button
              onClick={handleEdit}
              className="gap-2 rounded-full"
              size="lg"
            >
              <Edit className="h-5 w-5" />
              Bearbeiten
            </Button>
            <Button
              onClick={handleDelete}
              className="gap-2 rounded-full bg-rose-500 hover:bg-rose-600"
              size="lg"
            >
              <Trash2 className="h-5 w-5" />
              Löschen
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2 rounded-full"
              size="lg"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Speichert...' : 'Speichern'}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="rounded-full"
              size="lg"
            >
              <X className="h-5 w-5" />
              Abbrechen
            </Button>
          </>
        )}
      </div>

        {/* Edit Mode or View Mode */}
        {isEditing ? (
          <div className="bg-white/80 border border-amber-100/70 rounded-lg shadow-2xl backdrop-blur p-8">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">
              Artikel bearbeiten
            </h2>
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

        {/* Back Button at Bottom */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="gap-2 rounded-full"
            size="lg"
          >
            <ArrowLeft className="h-5 w-5" />
            Zurück zur Übersicht
          </Button>
        </div>
      </div>
    </div>
  );
}
