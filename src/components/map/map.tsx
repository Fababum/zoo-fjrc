import React from "react";
import mapImg from "../../assets/zoo-map.jpg";

function MapPage() {
  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <div style={titleWrapStyle}>
          <div style={kickerStyle}>ZOO FJRC</div>
          <h1 style={titleStyle}>Zoo-Plan</h1>
          <p style={subtitleStyle}>
            Orientierung auf einen Blick. Entdecke Bereiche, Wege und Highlights.
          </p>
        </div>
        <div style={mapWrapStyle}>
        <img src={mapImg} alt="Zoo Map" style={mapStyle} />
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
