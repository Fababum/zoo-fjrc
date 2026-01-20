import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { getOrders } from "@/api/orders";
import type { Order } from "@/api/orders";

export default function OrderHistory() {
  const auth = useAuth();
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
        setError(parsed.length ? "" : "Keine Bestellungen gefunden.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [auth.token, auth.user?.id]);

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
        <div className="text-slate-700">Lade Bestellungen…</div>
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
            Bestellverlauf
          </h1>
          <p className="text-base text-slate-600 mt-2">
            Hier siehst du alle gekauften Tickets.
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
                <div>Bestellung #{order.id}</div>
                <div>{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                {order.items.map((item) => (
                  <div key={item.title} className="flex justify-between">
                    <span>
                      {item.qty}× {item.title}
                    </span>
                    <span>CHF {(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between font-semibold text-slate-900">
                <span>Summe</span>
                <span>CHF {order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}

          {!orders.length && !error ? (
            <div className="text-center text-slate-600">
              Keine Bestellungen vorhanden.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
