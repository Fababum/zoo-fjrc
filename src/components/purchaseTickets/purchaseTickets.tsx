import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { TranslationsContext } from "../TranslationsContext";

const CART_STORAGE_KEY = "zoo.cart";

const SUPPORTED_LANGS = ["de", "en", "fr", "it"] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

type Ticket = {
  id: string;
  title: string;
  desc: string;
  price: string;
  image: string;
};

type CartItem = { id: string; title: string; price: number; qty: number };

const resolveLang = (contextLang?: string, routeLang?: string): SupportedLang => {
  if ((SUPPORTED_LANGS as readonly string[]).includes(contextLang ?? "")) {
    return contextLang as SupportedLang;
  }
  if ((SUPPORTED_LANGS as readonly string[]).includes(routeLang ?? "")) {
    return routeLang as SupportedLang;
  }
  return "de";
};

function TicketBuyPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const context = useContext(TranslationsContext);
  const { lang: routeLang } = useParams<{ lang?: string }>();
  const activeLang = resolveLang(context?.lang, routeLang);

  const t = {
    title: {
      de: "Tickets kaufen",
      en: "Buy tickets",
      fr: "Acheter des billets",
      it: "Acquista biglietti",
    },
    subtitle: {
      de: "Waehle dein Ticket und lege die gewuenschte Anzahl fest.",
      en: "Choose your ticket and set the quantity you want.",
      fr: "Choisissez votre billet et indiquez la quantite souhaitee.",
      it: "Scegli il biglietto e imposta la quantita desiderata.",
    },
    buyTicket: {
      de: "Ticket kaufen",
      en: "Buy ticket",
      fr: "Acheter un billet",
      it: "Acquista biglietto",
    },
    cart: { de: "Warenkorb", en: "Cart", fr: "Panier", it: "Carrello" },
    emptyCart: {
      de: "Keine Artikel",
      en: "No items",
      fr: "Aucun article",
      it: "Nessun articolo",
    },
    remove: { de: "Entfernen", en: "Remove", fr: "Retirer", it: "Rimuovi" },
    total: { de: "Summe", en: "Total", fr: "Total", it: "Totale" },
    continueShopping: {
      de: "Weiter einkaufen",
      en: "Continue shopping",
      fr: "Continuer les achats",
      it: "Continua a fare acquisti",
    },
    checkout: { de: "Kaufen", en: "Buy", fr: "Acheter", it: "Acquista" },
    loginRequired: {
      de: "Login erforderlich",
      en: "Login required",
      fr: "Connexion requise",
      it: "Accesso richiesto",
    },
    loginRequiredBody: {
      de: "Bitte logge dich ein, um den Einkauf abzuschliessen.",
      en: "Please sign in to complete the purchase.",
      fr: "Veuillez vous connecter pour finaliser l'achat.",
      it: "Effettua l'accesso per completare l'acquisto.",
    },
    cancel: { de: "Abbrechen", en: "Cancel", fr: "Annuler", it: "Annulla" },
    goToLogin: { de: "Zum Login", en: "Go to login", fr: "Se connecter", it: "Vai al login" },
  } as const;

  const tickets = useMemo<Ticket[]>(() => {
    const data: Record<SupportedLang, Ticket[]> = {
      de: [
        { id: "adult", title: "Erwachsene", desc: "ab 18 Jahren", price: "CHF 32.-", image: "/Elephant.png" },
        { id: "teen", title: "Jugendliche", desc: "13-17 Jahre", price: "CHF 26.-", image: "/Fuchs.png" },
        { id: "child", title: "Kinder", desc: "6-12 Jahre", price: "CHF 17.-", image: "/ElephantSquare.png" },
      ],
      en: [
        { id: "adult", title: "Adults", desc: "18+ years", price: "CHF 32.-", image: "/Elephant.png" },
        { id: "teen", title: "Teens", desc: "13-17 years", price: "CHF 26.-", image: "/Fuchs.png" },
        { id: "child", title: "Children", desc: "6-12 years", price: "CHF 17.-", image: "/ElephantSquare.png" },
      ],
      fr: [
        { id: "adult", title: "Adultes", desc: "18+ ans", price: "CHF 32.-", image: "/Elephant.png" },
        { id: "teen", title: "Ados", desc: "13-17 ans", price: "CHF 26.-", image: "/Fuchs.png" },
        { id: "child", title: "Enfants", desc: "6-12 ans", price: "CHF 17.-", image: "/ElephantSquare.png" },
      ],
      it: [
        { id: "adult", title: "Adulti", desc: "18+ anni", price: "CHF 32.-", image: "/Elephant.png" },
        { id: "teen", title: "Ragazzi", desc: "13-17 anni", price: "CHF 26.-", image: "/Fuchs.png" },
        { id: "child", title: "Bambini", desc: "6-12 anni", price: "CHF 17.-", image: "/ElephantSquare.png" },
      ],
    };
    return data[activeLang];
  }, [activeLang]);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (item) =>
          item &&
          typeof item.title === "string" &&
          typeof item.price === "number" &&
          typeof item.qty === "number"
      );
    } catch {
      return [];
    }
  });
  const [showCart, setShowCart] = useState(false);
  const [showLoginNeeded, setShowLoginNeeded] = useState(false);

  useEffect(() => {
    const initial: Record<string, number> = {};
    tickets.forEach((ticket) => {
      initial[ticket.id] = quantities[ticket.id] ?? 1;
    });
    setQuantities(initial);
  }, [tickets]);

  useEffect(() => {
    const byId = new Map(tickets.map((ticket) => [ticket.id, ticket]));
    setCart((cur) =>
      cur.map((item) => {
        const ticket = byId.get(item.id);
        if (!ticket) return item;
        return { ...item, title: ticket.title };
      })
    );
  }, [tickets]);

  const parsePrice = (priceStr: string) => {
    const m = priceStr.match(/\d+(?:[.,]\d+)?/);
    return m ? Number(m[0].replace(",", ".")) : 0;
  };

  const handleAddToCart = (ticketId: string, quantity: number) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;
    const price = parsePrice(ticket.price);

    setCart((cur) => {
      const existing = cur.find((c) => c.id === ticketId);
      if (existing) {
        return cur.map((c) => (c.id === ticketId ? { ...c, qty: c.qty + quantity } : c));
      }
      return [...cur, { id: ticketId, title: ticket.title, price, qty: quantity }];
    });
    setShowCart(true);
  };

  const handleRemoveFromCart = (ticketId: string) => {
    setCart((cur) => cur.filter((c) => c.id !== ticketId));
  };

  const handleUpdateQty = (ticketId: string, delta: number) => {
    setCart((cur) =>
      cur
        .map((c) => (c.id === ticketId ? { ...c, qty: Math.max(1, c.qty + delta) } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + c.qty * c.price, 0);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <div style={titleWrap}>
          <div style={kickerStyle}>ZOO FJRC</div>
          <h1 style={titleStyle}>{t.title[activeLang]}</h1>
          <p style={subtitleStyle}>{t.subtitle[activeLang]}</p>
        </div>

        <img src="/ticket-header.png" alt="Tickets" style={headerImage} />

        <div style={cardGrid}>
          {tickets.map((ticket) => (
            <div key={ticket.id} style={ticketCard}>
              <div style={ticketImageWrap}>
                <img src={ticket.image} alt={ticket.title} style={ticketImage} />
              </div>
              <div style={ticketBody}>
                <div>
                  <div style={ticketTitle}>{ticket.title}</div>
                  <div style={ticketDesc}>{ticket.desc}</div>
                </div>
                <div style={ticketMeta}>
                  <div style={price}>{ticket.price}</div>
                  <div style={qtyInline}>
                    <button
                      style={pillButton}
                      onClick={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [ticket.id]: Math.max(1, (prev[ticket.id] ?? 1) - 1),
                        }))
                      }
                    >
                      -
                    </button>
                    <div style={qtyDisplay}>{quantities[ticket.id] ?? 1}</div>
                    <button
                      style={pillButton}
                      onClick={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [ticket.id]: (prev[ticket.id] ?? 1) + 1,
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    style={button}
                    onClick={() => handleAddToCart(ticket.id, quantities[ticket.id] ?? 1)}
                  >
                    {t.buyTicket[activeLang]}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={cartButtonWrap}>
        <button style={cartButton} onClick={() => setShowCart((s) => !s)}>
          {t.cart[activeLang]} ({cartCount})
        </button>
        {showCart && (
          <div style={cartPane} onClick={(e) => e.stopPropagation()}>
            <h4>{t.cart[activeLang]}</h4>
            {cart.length === 0 ? (
              <div>{t.emptyCart[activeLang]}</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cart.map((c) => (
                  <div
                    key={c.id}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}
                  >
                    <div>{c.title}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button style={pillButton} onClick={() => handleUpdateQty(c.id, -1)}>-</button>
                      <div style={qtyDisplay}>{c.qty}</div>
                      <button style={pillButton} onClick={() => handleUpdateQty(c.id, 1)}>+</button>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div>CHF {(c.price * c.qty).toFixed(2)}</div>
                      <button onClick={() => handleRemoveFromCart(c.id)} style={smallButton}>
                        {t.remove[activeLang]}
                      </button>
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    borderTop: "1px solid #fde68a",
                    paddingTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                  }}
                >
                  <div>{t.total[activeLang]}</div>
                  <div>CHF {cartTotal.toFixed(2)}</div>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                  <button style={ghostButton} onClick={() => setShowCart(false)}>
                    {t.continueShopping[activeLang]}
                  </button>
                  <button
                    style={button}
                    onClick={() => {
                      if (auth.isLoggedIn) {
                        navigate("/purchase-card", { state: { cart, total: cartTotal } });
                      } else {
                        setShowLoginNeeded(true);
                      }
                    }}
                  >
                    {t.checkout[activeLang]}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showLoginNeeded && (
        <div style={modalOverlay} onClick={() => setShowLoginNeeded(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <h3>{t.loginRequired[activeLang]}</h3>
            <p>{t.loginRequiredBody[activeLang]}</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
              <button style={ghostButton} onClick={() => setShowLoginNeeded(false)}>
                {t.cancel[activeLang]}
              </button>
              <button
                style={button}
                onClick={() => navigate("/signIn", { state: { from: "/purchase-card", cart, total: cartTotal } })}
              >
                {t.goToLogin[activeLang]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundImage:
    "linear-gradient(135deg, rgba(255, 248, 235, 0.92), rgba(255, 255, 255, 0.92)), url('/Serengeti_Elefantenherde1.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "48px 24px",
  display: "flex",
  justifyContent: "center",
};

const contentStyle: React.CSSProperties = {
  width: "min(1100px, 100%)",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const titleWrap: React.CSSProperties = {
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

const headerImage: React.CSSProperties = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  borderRadius: "16px",
  border: "1px solid rgba(251, 191, 36, 0.45)",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
};

const cardGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "24px",
};

const ticketCard: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid rgba(226, 232, 240, 0.9)",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  display: "flex",
  flexDirection: "row",
  gap: "20px",
};

const ticketImageWrap: React.CSSProperties = {
  position: "relative",
  width: "38%",
  minWidth: "220px",
  height: "200px",
  overflow: "hidden",
};

const ticketImage: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const ticketBody: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "14px",
  padding: "18px 20px 18px 0",
  flex: 1,
};

const ticketMeta: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "baseline",
  gap: "12px",
  flexWrap: "wrap",
};

const price: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  color: "#0f172a",
};

const ticketTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "24px",
  fontWeight: 700,
  color: "#0f172a",
};

const ticketDesc: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: "15px",
  color: "#64748b",
};

const button: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: "999px",
  border: "1px solid rgba(251, 191, 36, 0.45)",
  backgroundColor: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(15, 23, 42, 0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modal: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  padding: "20px",
  borderRadius: "16px",
  width: "90%",
  maxWidth: "400px",
  border: "1px solid rgba(251, 191, 36, 0.4)",
  boxShadow: "0 18px 36px rgba(15, 23, 42, 0.16)",
};

const cartButtonWrap: React.CSSProperties = {
  position: "fixed",
  right: 20,
  bottom: 20,
  zIndex: 9998,
};

const cartButton: React.CSSProperties = {
  background: "#111827",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid rgba(251, 191, 36, 0.3)",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 600,
  boxShadow: "0 12px 24px rgba(15, 23, 42, 0.2)",
};

const cartPane: React.CSSProperties = {
  width: 320,
  background: "rgba(255, 255, 255, 0.95)",
  borderRadius: 16,
  border: "1px solid rgba(251, 191, 36, 0.35)",
  boxShadow: "0 18px 36px rgba(15,23,42,0.16)",
  padding: 16,
  marginTop: 8,
};

const smallButton: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid rgba(148, 163, 184, 0.4)",
  background: "#f8fafc",
  cursor: "pointer",
  fontSize: 12,
  color: "#475569",
};

const ghostButton: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: "999px",
  border: "1px solid rgba(148, 163, 184, 0.4)",
  backgroundColor: "#fff",
  color: "#1f2937",
  cursor: "pointer",
  fontWeight: 600,
};

const pillButton: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 999,
  border: "1px solid rgba(251, 191, 36, 0.4)",
  backgroundColor: "#fff",
  cursor: "pointer",
  fontWeight: 700,
  color: "#92400e",
};

const qtyDisplay: React.CSSProperties = {
  minWidth: 24,
  textAlign: "center",
  fontWeight: 700,
  color: "#111827",
};

const qtyInline: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

export default TicketBuyPage;
