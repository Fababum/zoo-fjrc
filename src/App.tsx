import NavBar from "./components/navBar/navBar";
import NotFound from "./components/errorpage/errorpage";
import SignIn from "./components/signIn/signIn";
import SignUp from "./components/signeUp/signeUp";
import SignUpConfirmation from "./components/signUpConfirmation/signUpConfirmation";
import { Routes, Route } from "react-router-dom";
import MapPage from "./components/map/map";
import Articles from "./components/articles/articles";
import FloatingTicket from "./components/floatingTicket/floatingTicket";
import TicketBuyPage from "./components/purchaseTickets/purchaseTickets";

function App() {
  const path = window.location.pathname;
  // List of known app routes (add more as your app grows)
  const knownPaths = ['/', '/homepage', '/home', '/signin', '/signUp', '/signup', '/purchaseTickets', '/articles', '/map'];
  const isKnown = knownPaths.includes(path.toLowerCase());

  return (
    <>
      <NavBar />
      <FloatingTicket />
      {!isKnown && <NotFound />}
       <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/articles/:article" element={<Articles />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/signUpConfirmation" element={<SignUpConfirmation />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/purchaseTickets" element={<TicketBuyPage />} />
       </Routes>
    </>
  );
}

export default App