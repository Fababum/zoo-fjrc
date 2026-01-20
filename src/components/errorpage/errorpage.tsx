import { useContext } from "react";
import { useParams } from "react-router-dom";
import { TranslationsContext } from "../TranslationsContext";
import "./errorpage.css";
import tumbleweed from "./Tumbleweed.png";
import errorpage from "./background.png";

const SUPPORTED_LANGS = ["de", "en", "fr", "it"] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const resolveLang = (contextLang?: string, routeLang?: string): SupportedLang => {
  if ((SUPPORTED_LANGS as readonly string[]).includes(contextLang ?? "")) {
    return contextLang as SupportedLang;
  }
  if ((SUPPORTED_LANGS as readonly string[]).includes(routeLang ?? "")) {
    return routeLang as SupportedLang;
  }
  return "de";
};

export default function NotFound() {
  const context = useContext(TranslationsContext);
  const { lang: routeLang } = useParams<{ lang?: string }>();
  const activeLang = resolveLang(context?.lang, routeLang);
  const t = {
    title: { de: "Fehler", en: "Error", fr: "Erreur", it: "Errore" },
    subtitle: {
      de: "Seite nicht gefunden",
      en: "Page not found",
      fr: "Page introuvable",
      it: "Pagina non trovata",
    },
    back: {
      de: "Zurueck zur Startseite",
      en: "Go back home",
      fr: "Retour a l'accueil",
      it: "Torna alla home",
    },
  } as const;

  return (
    <div style={{
      backgroundImage: `url(${errorpage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      position: 'relative'
    }}>
        <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          paddingLeft: '100px',
          paddingRight: '100px',
          paddingBottom: '20px',
          paddingTop: '0px',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}
      >
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "0", marginTop: "20px" }}>{t.title[activeLang]}</h1>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "0", marginTop: "-15px" }}>404</h1>
        <div
        style={{
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>

      </div>
        <p style={{ marginBottom: "0", marginTop: "15px"}}>{t.subtitle[activeLang]}</p>
        <a href={`/${activeLang}`} style={{ color: '#0066cc' }}>
          {t.back[activeLang]}
        </a>
      </div>
        <div>
        <img
          src={tumbleweed}
          alt="Error Illustration"
          className="tumbleweed"
        />
      </div>
    </div>

  );
}
