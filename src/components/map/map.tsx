function MapPage() {
  return (
    <div style={styles.page}>
      <img
        src="/zoo-map.png"
        alt="Map"
        style={styles.map}
      />
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#E1DCBE",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  map: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,0,0,0.3)"
  }
};

export default MapPage;
