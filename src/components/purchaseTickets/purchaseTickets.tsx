import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";

function TicketBuyPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loadingTicket, setLoadingTicket] = useState<string | null>(null);

  const handleBuy = async (ticketTitle: string) => {
    if (!auth.isLoggedIn) {
      navigate("/signIn");
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
    } catch (err) {
      alert("Error purchasing ticket");
    } finally {
      setLoadingTicket(null);
    }
  };

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
              <button
                style={button}
                onClick={() => handleBuy(ticket.title)}
                disabled={loadingTicket !== null}
              >
                {loadingTicket === ticket.title ? "Bitte warten..." : "Ticket kaufen"}
              </button>
            </div>
          </div>
        ))}
      </div>
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

export default TicketBuyPage;