import React from "react";
import { Link } from "react-router-dom";


export default function FloatingTicket() {
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
    <Link to="/purchaseTickets" style={container} aria-label="Buy tickets" className="floating-ticket">
      <div style={box}>
        <img src="/ticket.png" alt="Ticket" style={imgStyle} />
        <span>Buy Tickets</span>
      </div>
    </Link>
  );
}
