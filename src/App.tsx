
import NavBar from "./components/navBar/navBar";
import NotFound from "./components/errorpage/errorpage";

function App() {
  const path = window.location.pathname;
  // List of known app routes (add more as your app grows)
  const knownPaths = ['/', '/homepage', '/home', '/signin', '/signUp', '/signup', '/purchaseTickets', '/articles', '/map'];
  const isKnown = knownPaths.includes(path.toLowerCase());

  return (
    <>
      <NavBar />
      {!isKnown && <NotFound />}
    </>
  );
}

export default App