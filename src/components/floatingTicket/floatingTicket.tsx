import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { TranslationsContext } from "../TranslationsContext";

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


export default function FloatingTicket() {
  const context = useContext(TranslationsContext);
  const { lang: routeLang } = useParams<{ lang?: string }>();
  const activeLang = resolveLang(context?.lang, routeLang);
  const t = {
    label: {
      de: "Tickets kaufen",
      en: "Buy tickets",
      fr: "Acheter des billets",
      it: "Acquista biglietti",
    },
    aria: {
      de: "Tickets kaufen",
      en: "Buy tickets",
      fr: "Acheter des billets",
      it: "Acquista biglietti",
    },
  } as const;

  const container: React.CSSProperties = {
    position: "fixed",
    bottom: "18px",
    left: "18px",
    zIndex: 9999,
  };

  const box: React.CSSProperties = {
    backgroundColor: "#6E5B3A",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "10px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 600,
    fontSize: "14px",
    textDecoration: "none",
  };

  const imgStyle: React.CSSProperties = {
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    objectFit: "cover",
    display: "block",
  };


  return (
    <Link
      to={`/${activeLang}/purchaseTickets`}
      style={container}
      aria-label={t.aria[activeLang]}
      className="floating-ticket"
    >
      <div style={box}>
        <img src="/ticket.png" alt="Ticket" style={imgStyle} />
        <span>{t.label[activeLang]}</span>
      </div>
    </Link>
  );
}
