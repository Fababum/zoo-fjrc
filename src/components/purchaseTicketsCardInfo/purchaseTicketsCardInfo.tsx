import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function PurchaseTicketsCardInfo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cardType, setCardType] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const location = useLocation();
  const total = location.state && (location.state as any).total ? (location.state as any).total : 0;

  return (
    <div style={pageWrap}>
      <div style={card}>
        <h2 style={title}>Card Deetails</h2>

        <div style={field}>
          <label style={label}>Cardholder's full name</label>
          <input style={input} value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div style={field}>
          <label style={label}>Email</label>
          <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div style={field}>
          <label style={label}>Credit Card Type</label>
          <select style={input} value={cardType} onChange={(e) => setCardType(e.target.value)}>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="amex">American Express</option>
            <option value="discover">Discover</option>
          </select>
        </div>

        <div style={field}>
          <label style={label}>Card Number</label>
          <input
            style={input}
            inputMode="numeric"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={label}>Good Until</label>
            <input style={input} type="month" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          </div>

          <div style={{ width: 120 }}>
            <label style={label}>CVV</label>
            <input
              style={input}
              inputMode="numeric"
              maxLength={4}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
            />
          </div>
        </div>

        {total ? <div style={{ marginTop: 12, fontWeight: 700 }}>Total to charge: CHF {Number(total).toFixed(2)}</div> : null}
      </div>
    </div>
  );
}

const pageWrap: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  padding: 20,
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 520,
  background: "#ffffff",
  padding: 24,
  borderRadius: 8,
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const title: React.CSSProperties = {
  margin: 0,
  marginBottom: 8,
  fontSize: 20,
  fontWeight: 600,
};

const field: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const label: React.CSSProperties = {
  fontSize: 13,
  color: "#333",
};

const input: React.CSSProperties = {
  height: 40,
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ddd",
  fontSize: 14,
};

export default PurchaseTicketsCardInfo;
