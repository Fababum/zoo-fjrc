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
  maxWidth: "70%",
  maxHeight: "70%",
  marginTop: "80px",
  borderRadius: "12px"
};

const sidebarStyle: React.CSSProperties = {
  position: "absolute",
  right: "20px",
  width: "140px",
  maxWidth: "20%",
  background: "white",
  marginTop: "40px"
};

// make the container relative so the absolute sidebar positions correctly
pageStyle.position = pageStyle.position ?? "relative";

export default MapPage;