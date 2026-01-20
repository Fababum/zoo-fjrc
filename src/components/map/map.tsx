import React, { useContext } from "react";
import mapImg from "../../assets/zoo-map.jpg";
import { TranslationsContext } from "../TranslationsContext";

const SUPPORTED_LANGS = ["de", "en", "fr", "it"] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const resolveLang = (value?: string): SupportedLang => {
  return (SUPPORTED_LANGS as readonly string[]).includes(value ?? "")
    ? (value as SupportedLang)
    : "de";
};

function MapPage() {
  const context = useContext(TranslationsContext);
  const lang = resolveLang(context?.lang);
  const t = {
    kicker: {
      de: "ZOO FJRC",
      en: "ZOO FJRC",
      fr: "ZOO FJRC",
      it: "ZOO FJRC",
    },
    title: {
      de: "Zoo-Plan",
      en: "Zoo map",
      fr: "Plan du zoo",
      it: "Mappa dello zoo",
    },
    subtitle: {
      de: "Orientierung auf einen Blick. Entdecke Bereiche, Wege und Highlights.",
      en: "Orientation at a glance. Discover areas, paths, and highlights.",
      fr: "Orientation en un coup d'oeil. Decouvrez zones, chemins, et points forts.",
      it: "Orientamento a colpo d'occhio. Scopri aree, percorsi e highlight.",
    },
    mapAlt: {
      de: "Zoo-Karte",
      en: "Zoo map",
      fr: "Carte du zoo",
      it: "Mappa dello zoo",
    },
  } as const;

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <div style={titleWrapStyle}>
          <div style={kickerStyle}>{t.kicker[lang]}</div>
          <h1 style={titleStyle}>{t.title[lang]}</h1>
          <p style={subtitleStyle}>
            {t.subtitle[lang]}
          </p>
        </div>
        <div style={mapWrapStyle}>
        <img src={mapImg} alt={t.mapAlt[lang]} style={mapStyle} />
        </div>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundImage:
    "linear-gradient(135deg, rgba(255, 248, 235, 0.92), rgba(255, 255, 255, 0.92)), url('/ElephantSquare.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "48px 24px",
};

const contentStyle: React.CSSProperties = {
  width: "min(1100px, 100%)",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const titleWrapStyle: React.CSSProperties = {
  textAlign: "center",
};

const kickerStyle: React.CSSProperties = {
  fontSize: "12px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#92400e",
  fontWeight: 700,
};

const titleStyle: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: 700,
  color: "#111827",
  marginTop: "8px",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#4b5563",
  marginTop: "8px",
};

const mapWrapStyle: React.CSSProperties = {
  position: "relative",
  width: "min(1000px, 100%)",
  margin: "0 auto",
};

const mapStyle: React.CSSProperties = {
  width: "100%",
  height: "auto",
  borderRadius: "20px",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.18)",
  border: "1px solid rgba(251, 191, 36, 0.5)",
};

export default MapPage;
