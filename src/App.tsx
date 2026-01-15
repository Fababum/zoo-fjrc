import NavBar from "./components/navBar/navBar";
import NotFound from "./components/errorpage/errorpage";
import SignIn from "./components/signIn/signIn";
import SignUp from "./components/signeUp/signeUp";
import SignUpConfirmation from "./components/signUpConfirmation/signUpConfirmation";
import { Routes, Route, useParams, Navigate, useLocation } from "react-router-dom";
import MapPage from "./components/map/map";
import Articles from "./components/articles/articles";

import Home from "./components/homepage/homepage";

import Chatbot from "./components/chatbot/Chatbot";
import { useContext, useEffect } from "react";
import { TranslationsContext } from "./components/TranslationsContext";
import FloatingTicket from "./components/floatingTicket/floatingTicket";
import TicketBuyPage from "./components/purchaseTickets/purchaseTickets";
import PurchaseTicketsCardInfo from "./components/purchaseTicketsCardInfo/purchaseTicketsCardInfo";
import { useAuth } from "./components/AuthContext";
import NewsArticlePage from "./components/news/news";
import OrderHistory from "./components/orders/orderHistory";

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

function RequireAuth({
  children,
  redirectTo = "/signIn",
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

function LanguageProtected({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang?: string }>();
  const redirectTo = lang ? `/${lang}/signIn` : "/signIn";

  return <RequireAuth redirectTo={redirectTo}>{children}</RequireAuth>;
}

function App() {
  return (
    <>
      <NavBar />
      <FloatingTicket />
       <Routes>
            <Route path="/" element={<Home/>} />
            <Route
              path="/map"
              element={
                <RequireAuth>
                  <MapPage />
                </RequireAuth>
              }
            />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/signUpConfirmation" element={<SignUpConfirmation />} />
            <Route path="/news/:slug" element={<NewsArticlePage />} />
            <Route
              path="/articles/:article"
              element={
                <RequireAuth>
                  <Articles />
                </RequireAuth>
              }
            />
            <Route
              path="/articles"
              element={
                <RequireAuth>
                  <Articles />
                </RequireAuth>
              }
            />
            <Route
              path="/purchaseTickets"
              element={
                <RequireAuth>
                  <TicketBuyPage />
                </RequireAuth>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireAuth>
                  <OrderHistory />
                </RequireAuth>
              }
            />
            <Route
              path="/purchase-card"
              element={
                <RequireAuth>
                  <PurchaseTicketsCardInfo />
                </RequireAuth>
              }
            />
            <Route path="/:lang" element={<LanguageWrapper><Home /></LanguageWrapper>} />
            <Route
              path="/:lang/map"
              element={
                <LanguageWrapper>
                  <LanguageProtected>
                    <MapPage />
                  </LanguageProtected>
                </LanguageWrapper>
              }
            />
            <Route path="/:lang/signIn" element={<LanguageWrapper><SignIn /></LanguageWrapper>} />
            <Route path="/:lang/signUp" element={<LanguageWrapper><SignUp /></LanguageWrapper>} />
            <Route path="/:lang/signUpConfirmation" element={<LanguageWrapper><SignUpConfirmation /></LanguageWrapper>} />
            <Route path="/:lang/news/:slug" element={<LanguageWrapper><NewsArticlePage /></LanguageWrapper>} />
            <Route
              path="/:lang/articles/:article"
              element={
                <LanguageWrapper>
                  <LanguageProtected>
                    <Articles />
                  </LanguageProtected>
                </LanguageWrapper>
              }
            />
            <Route
              path="/:lang/articles"
              element={
                <LanguageWrapper>
                  <LanguageProtected>
                    <Articles />
                  </LanguageProtected>
                </LanguageWrapper>
              }
            />
            <Route
              path="/:lang/chatbot"
              element={
                <LanguageWrapper>
                  <LanguageProtected>
                    <Chatbot />
                  </LanguageProtected>
                </LanguageWrapper>
              }
            />
            <Route
              path="/:lang/purchaseTickets"
              element={
                <LanguageWrapper>
                  <LanguageProtected>
                    <TicketBuyPage />
                  </LanguageProtected>
                </LanguageWrapper>
              }
            />
            <Route
              path="/:lang/orders"
              element={
                <LanguageWrapper>
                  <LanguageProtected>
                    <OrderHistory />
                  </LanguageProtected>
                </LanguageWrapper>
              }
            />
            <Route path="*" element={<NotFound />} />
       </Routes>
    </>
  );
}

export default App
