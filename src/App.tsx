
import NavBar from "./components/navBar/navBar";
import NotFound from "./components/errorpage/errorpage";
import SignIn from "./components/signIn/signIn";
import SignUp from "./components/signeUp/signeUp";
import SignUpConfirmation from "./components/signUpConfirmation/signUpConfirmation";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import MapPage from "./components/map/map";
import Articles from "./components/articles/articles";
import Chatbot from "./components/chatbot/Chatbot";
import { useContext, useEffect } from "react";
import { TranslationsContext } from "./components/TranslationsContext";

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
       <Routes>
            <Route path="/" element={<Navigate to="/de" replace />} />
            <Route path="/:lang" element={<LanguageWrapper><h1>Home</h1></LanguageWrapper>} />
            <Route path="/:lang/map" element={<LanguageWrapper><MapPage /></LanguageWrapper>} />
            <Route path="/:lang/signIn" element={<LanguageWrapper><SignIn /></LanguageWrapper>} />
            <Route path="/:lang/articles/:article" element={<LanguageWrapper><Articles /></LanguageWrapper>} />
            <Route path="/:lang/articles" element={<LanguageWrapper><Articles /></LanguageWrapper>} />
            <Route path="/:lang/signUp" element={<LanguageWrapper><SignUp /></LanguageWrapper>} />
            <Route path="/:lang/signUpConfirmation" element={<LanguageWrapper><SignUpConfirmation /></LanguageWrapper>} />
            <Route path="/:lang/chatbot" element={<LanguageWrapper><Chatbot /></LanguageWrapper>} />
            <Route path="*" element={<NotFound />} />
       </Routes>
    </>
  );
}

export default App