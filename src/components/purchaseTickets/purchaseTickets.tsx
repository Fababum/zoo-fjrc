import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";

function TicketBuyPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loadingTicket, setLoadingTicket] = useState<string | null>(null);
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<Array<{ title: string; price: number; qty: number }>>(() => []);
  const [showCart, setShowCart] = useState(false);
  const [showLoginNeeded, setShowLoginNeeded] = useState(false);

  const parsePrice = (priceStr: string) => {
    // parse strings like "CHF 32.-" to number 32
    const m = priceStr.match(/\d+(?:[.,]\d+)?/);
    return m ? Number(m[0].replace(',', '.')) : 0;
  };

  const handleBuy = (ticketTitle: string) => {
    setSelectedTicket(ticketTitle);
    setQty(1);
    setShowQtyModal(true);
  };

  const handleAddToCart = (title: string, quantity: number) => {
    const ticket = tickets.find((t) => t.title === title);
    if (!ticket) return;
    const price = parsePrice(ticket.price);

    setCart((cur) => {
      const existing = cur.find((c) => c.title === title);
      if (existing) {
        return cur.map((c) => (c.title === title ? { ...c, qty: c.qty + quantity } : c));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingTicket, setPendingTicket] = useState<string | null>(null);

  const handleBuy = async (ticketTitle: string) => {
    if (!auth.isLoggedIn) {
      setPendingTicket(ticketTitle);
      setShowLoginModal(true);
      return;
    }

    setLoadingTicket(ticketTitle);
    try {
      const res = await fetch("/api/buy-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
        },
        body: JSON.stringify({ ticket: ticketTitle }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert("Purchase failed: " + text);
      } else {
        alert("Ticket purchased: " + ticketTitle);
      }
      return [...cur, { title, price, qty: quantity }];
    });
    setShowQtyModal(false);
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + c.qty * c.price, 0);

  return (
    <div style={pageStyle}>
      <img src="/ticket-header.png" alt="Tickets" style={headerImage} />

      <div style={bar}></div>

      <div style={listWrapper}>
        <div style={headerCard} className="ticket-card header-card">
          <div style={leftSide}>Kategorie</div>
          <div style={rightSide}>Preis</div>
        </div>
        {tickets.map((ticket) => (
          <div key={ticket.title} style={ticketCard} className="ticket-card">
            <div style={leftSide}>
              <h3>{ticket.title}</h3>
              <p>{ticket.desc}</p>
            </div>

            <div style={rightSide}>
              <div style={price}>{ticket.price}</div>
              <button style={button} onClick={() => handleBuy(ticket.title)}>
                Ticket kaufen
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quantity modal */}
      {showQtyModal && selectedTicket && (
        <div style={modalOverlay} onClick={() => setShowQtyModal(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <h3>Anzahl wählen</h3>
            <p>{selectedTicket}</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
              <div>{qty}</div>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button style={{ ...button, backgroundColor: '#ccc', color: '#000' }} onClick={() => setShowQtyModal(false)}>Abbrechen</button>
              <button style={button} onClick={() => handleAddToCart(selectedTicket, qty)}>Zum Warenkorb</button>
            </div>
          </div>
        </div>
      )}

      {/* Cart button */}
      <div style={cartButtonWrap}>
        <button style={cartButton} onClick={() => setShowCart((s) => !s)}>
          🛒 {cartCount}
        </button>
        {showCart && (
          <div style={cartPane} onClick={(e) => e.stopPropagation()}>
            <h4>Warenkorb</h4>
            {cart.length === 0 ? (
              <div>Keine Artikel</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cart.map((c) => (
                  <div key={c.title} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{c.title} × {c.qty}</div>
                    <div>CHF { (c.price * c.qty).toFixed(2) }</div>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #eee', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <div>Summe</div>
                  <div>CHF {cartTotal.toFixed(2)}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                  <button style={{ ...button, backgroundColor: '#ccc', color: '#000' }} onClick={() => setShowCart(false)}>Weiter einkaufen</button>
                  <button
                    style={button}
                    onClick={() => {
                      if (auth.isLoggedIn) {
                        navigate('/purchase-card', { state: { cart, total: cartTotal } });
                      } else {
                        // show login-needed prompt; user can proceed to sign-in which receives cart state
                        setShowLoginNeeded(true);
                      }
                    }}
                  >
                    Buy
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
            <h3>Login erforderlich</h3>
            <p>Bitte logge dich ein, um den Einkauf abzuschliessen.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button style={{ ...button, backgroundColor: '#ccc', color: '#000' }} onClick={() => setShowLoginNeeded(false)}>Abbrechen</button>
              <button style={button} onClick={() => navigate('/signIn', { state: { from: '/purchase-card', cart, total: cartTotal } })}>Zum Login</button>
      {showLoginModal && (
        <div style={modalOverlay} onClick={() => setShowLoginModal(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <h3>Login required</h3>
            <p>Bitte logge dich ein, um ein Ticket zu kaufen.</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                style={{ ...button, backgroundColor: "#ccc", color: "#000" }}
                onClick={() => setShowLoginModal(false)}
              >
                Abbrechen
              </button>
              <button
                style={button}
                onClick={() => {
                  setShowLoginModal(false);
                  // navigate to sign-in; you may keep pendingTicket to resume purchase after login
                  navigate("/signIn");
                }}
              >
                Zum Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

      

const tickets = [
  {
    title: "Erwachsene",
    desc: "ab 18 Jahren",
    price: "CHF 32.-"
  },
  {
    title: "Jugendliche",
    desc: "13–17 Jahre",
    price: "CHF 26.-"
  },
  {
    title: "Kinder",
    desc: "6–12 Jahre",
    price: "CHF 17.-"
  }
];

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#ffffffff"
};

const headerImage: React.CSSProperties = {
  width: "100%",
  height: "200px",
  objectFit: "cover"
};

const bar: React.CSSProperties = {
  height: "40px",
  backgroundColor: "#cacacaff"
};

const listWrapper: React.CSSProperties = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
};

const headerCard: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid #a8a8a8",
  padding: "10px 15px",
  color: "#555",
  fontWeight: 700,
};

const listDetail: React.CSSProperties = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
};

const ticketCard: React.CSSProperties = {
  backgroundColor: "#ebebebff",
  padding: "15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid #e0e0e0",
};

const leftSide: React.CSSProperties = {
  display: "flex",
  flexDirection: "column"
};

const rightSide: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "10px"
};

const price: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "bold"
};

const button: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#6E5B3A",
  color: "#fff",
  cursor: "pointer"
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modal: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "400px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const cartButtonWrap: React.CSSProperties = {
  position: 'fixed',
  right: 20,
  bottom: 20,
  zIndex: 9998,
};

const cartButton: React.CSSProperties = {
  background: '#6E5B3A',
  color: '#fff',
  padding: '10px 14px',
  borderRadius: 999,
  border: 'none',
  cursor: 'pointer',
  fontSize: 16,
};

const cartPane: React.CSSProperties = {
  width: 300,
  background: '#fff',
  borderRadius: 8,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  padding: 12,
  marginTop: 8,
};

export default TicketBuyPage;