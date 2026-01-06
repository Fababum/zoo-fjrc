
import NavBar from "./components/navBar/navBar";

import { Routes, Route } from "react-router-dom";
import MapPage from "./components/map/map";

function App() {
  return (
    <>
      <NavBar />
       <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/map" element={<MapPage />} />
       </Routes>
    </>
  );
}

export default App