import { useEffect, useState, useContext } from "react";
import { useAuth } from "@/components/AuthContext";
import { getOrders } from "@/api/orders";
import type { Order } from "@/api/orders";
import { TranslationsContext } from "../TranslationsContext";

const SUPPORTED_LANGS = ["de", "en", "fr", "it"] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const resolveLang = (value?: string): SupportedLang => {
  return (SUPPORTED_LANGS as readonly string[]).includes(value ?? "")
    ? (value as SupportedLang)
    : "de";
};

export default function OrderHistory() {
  const auth = useAuth();
  const context = useContext(TranslationsContext);
  const lang = resolveLang(context?.lang);
  const t = {
    loading: {
      de: "Lade Bestellungen...",
      en: "Loading orders...",
      fr: "Chargement des commandes...",
      it: "Caricamento ordini...",
    },
    header: {
      de: "Bestellverlauf",
      en: "Order history",
      fr: "Historique des commandes",
      it: "Storico ordini",
    },
    subtitle: {
      de: "Hier siehst du alle gekauften Tickets.",
      en: "Here you can see all purchased tickets.",
      fr: "Ici, vous voyez tous les billets achetes.",
      it: "Qui vedi tutti i biglietti acquistati.",
    },
    notFound: {
      de: "Keine Bestellungen gefunden.",
      en: "No orders found.",
      fr: "Aucune commande trouvee.",
      it: "Nessun ordine trovato.",
    },
    empty: {
      de: "Keine Bestellungen vorhanden.",
      en: "No orders available.",
      fr: "Aucune commande disponible.",
      it: "Nessun ordine disponibile.",
    },
    orderLabel: {
      de: "Bestellung",
      en: "Order",
      fr: "Commande",
      it: "Ordine",
    },
    total: { de: "Summe", en: "Total", fr: "Total", it: "Totale" },
  } as const;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!auth.token) return;
      const storageKey = `zoo.orders.${auth.user?.id ?? "guest"}`;

      try {
        const data = await getOrders(auth.token);
        setOrders(data);
        setError("");
      } catch {
        const raw = localStorage.getItem(storageKey);
        const parsed = raw ? (JSON.parse(raw) as Order[]) : [];
        setOrders(parsed);
        setError(parsed.length ? "" : t.notFound[lang]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [auth.token, auth.user?.id, lang, t.notFound]);

  if (loading) {
    return (
      <div
        className="min-h-screen px-4 py-12 flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255, 248, 235, 0.92), rgba(255, 255, 255, 0.92)), url('/ElephantSquare.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-slate-700">{t.loading[lang]}</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-12"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(255, 248, 235, 0.92), rgba(255, 255, 255, 0.92)), url('/ElephantSquare.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-xs tracking-[0.3em] uppercase text-amber-800 font-semibold">
            ZOO FJRC
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 mt-2">
            {t.header[lang]}
          </h1>
          <p className="text-base text-slate-600 mt-2">
            {t.subtitle[lang]}
          </p>
          {error ? (
            <p className="text-sm text-rose-600 mt-3">{error}</p>
          ) : null}
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-amber-100/70 rounded-2xl bg-white/90 shadow-lg p-6"
            >
              <div className="flex items-center justify-between text-sm text-slate-600">
                <div>{t.orderLabel[lang]} #{order.id}</div>
                <div>{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                {order.items.map((item) => (
                  <div key={item.title} className="flex justify-between">
                    <span>
                      {item.qty}x {item.title}
                    </span>
                    <span>CHF {(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between font-semibold text-slate-900">
                <span>{t.total[lang]}</span>
                <span>CHF {order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}

          {!orders.length && !error ? (
            <div className="text-center text-slate-600">
              {t.empty[lang]}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
