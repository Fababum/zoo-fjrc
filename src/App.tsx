import SignIn from "./components/signIn/signIn";
import NavBar from "./components/navBar/navBar";
import SignUp from "./components/signeUp/signeUp";
import SignUpConfirmation from "./components/signUpConfirmation/signUpConfirmation";
import { Routes, Route } from "react-router-dom";
import Errorpage from "./components/errorpage/errorpage";
import MapPage from "./components/map/map";

function App() {
  return (
    <>
      <NavBar />
       <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/signUpConfirmation" element={<SignUpConfirmation />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="*" element={<Errorpage />} />
       </Routes>
    </>
  );
}

export default App