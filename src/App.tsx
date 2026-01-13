import NavBar from "./components/navBar/navBar";
import NotFound from "./components/errorpage/errorpage";
import SignIn from "./components/signIn/signIn";
import SignUp from "./components/signeUp/signeUp";
import SignUpConfirmation from "./components/signUpConfirmation/signUpConfirmation";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import MapPage from "./components/map/map";
import Articles from "./components/articles/articles";

import { Routes, Route } from "react-router-dom";
import Home from "./components/homepage/homepage"

import Chatbot from "./components/chatbot/Chatbot";
import { useContext, useEffect } from "react";
import { TranslationsContext } from "./components/TranslationsContext";
import FloatingTicket from "./components/floatingTicket/floatingTicket";
import TicketBuyPage from "./components/purchaseTickets/purchaseTickets";
import PurchaseTicketsCardInfo from "./components/purchaseTicketsCardInfo/purchaseTicketsCardInfo";

function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang: string }>();
  const context = useContext(TranslationsContext);
  
  useEffect(() => {
    if (lang && context && ['de', 'en', 'fr', 'it'].includes(lang)) {
      context.setLang(lang);
    }
  }, [lang, context]);

  return <>{children}</>;
}


function App() {
  return (
    <>
      <NavBar />
      <FloatingTicket />
       <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/articles/:article" element={<Articles />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/signUpConfirmation" element={<SignUpConfirmation />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/purchaseTickets" element={<TicketBuyPage />} />
            <Route path="/purchase-card" element={<PurchaseTicketsCardInfo />} />
            <Route path="/" element={<Navigate to="/de" replace />} />
            <Route path="/:lang" element={<LanguageWrapper><h1>Home</h1></LanguageWrapper>} />
            <Route path="/:lang/map" element={<LanguageWrapper><MapPage /></LanguageWrapper>} />
            <Route path="/:lang/signIn" element={<LanguageWrapper><SignIn /></LanguageWrapper>} />
            <Route path="/:lang/articles/:article" element={<LanguageWrapper><Articles /></LanguageWrapper>} />
            <Route path="/:lang/articles" element={<LanguageWrapper><Articles /></LanguageWrapper>} />
            <Route path="/:lang/signUp" element={<LanguageWrapper><SignUp /></LanguageWrapper>} />
            <Route path="/:lang/signUpConfirmation" element={<LanguageWrapper><SignUpConfirmation /></LanguageWrapper>} />
            <Route path="/:lang/chatbot" element={<LanguageWrapper><Chatbot /></LanguageWrapper>} />
            <Route path="/:lang/purchaseTickets" element={<LanguageWrapper><TicketBuyPage /></LanguageWrapper>} />
            <Route path="*" element={<NotFound />} />
       </Routes>
    </>
  );
}

export default App