import React from "react";
import mapImg from "../../assets/zoo-map.jpg";
import sidebarImg from "../../assets/map-sidebar.png";

function MapPage() {
  return (
    <div style={pageStyle}>
      <img src={mapImg} alt="Zoo Map" style={mapStyle} />
      <img
        src={sidebarImg}
        alt="Sidebar placeholder"
        style={sidebarStyle}
      />
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  backgroundColor: "#E1DCBE",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const mapStyle: React.CSSProperties = {
  maxWidth: "60%",
  maxHeight: "60%",
  marginTop: "80px",
  borderRadius: "12px"
};

const sidebarStyle: React.CSSProperties = {
  position: "absolute",
  right: "20px",
  top: "50%",
  transform: "translateY(-50%)",
  width: "140px",
  maxWidth: "20%",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  background: "white",
  objectFit: "cover",
  marginTop: "40px"
};

// make the container relative so the absolute sidebar positions correctly
pageStyle.position = pageStyle.position ?? "relative";

export default MapPage;