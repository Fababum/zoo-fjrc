import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";


import { TranslationsContext } from "../TranslationsContext";

import "./signin.css"
import { useContext } from "react";

function SignIn() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

const navigate = useNavigate();
const context = useContext(TranslationsContext);

if (!context) {
  return null;
}

const { translations, lang } = context;
const t = translations.signIn as Record<string, any>;

  const auth = useAuth();

  const location = useLocation();

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // In a real app, call the backend to authenticate and get a token.
    // For now we simulate success and store a simple token.
    const fakeToken = btoa(email + ":fake-token");
    auth.login(fakeToken);
    // If the sign-in was requested from another flow, redirect there with state (cart/total)
    const state = (location.state || {}) as any;
    if (state && state.from) {
      navigate(state.from, { state: { cart: state.cart, total: state.total } });
    } else {
      navigate("/");
    }
  };

  return (

    <div className="background">
      <Card className="w-full max-w-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 1)'}}>
        <CardHeader>
          <CardTitle className="text-2xl">{t.title[lang]}</CardTitle>
          <CardDescription className="text-base">
            {t.description[lang]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-base">{t.email[lang]}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder[lang]}
                required
                className="h-11 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-base">{t.password[lang]}</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                className="h-12 text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <div className = "login-signeUp">
              <Button onClick={handleLogin} className="w-full h-12 text-base hover:bg-gray-200 hover:text-black">
                {t.loginButton[lang]}
              </Button>
              <Button   type="button" onClick={() => navigate("/signUp")} className="w-full h-12 text-base hover:bg-gray-200 hover:text-black">
                {t.signUpButton[lang]}
              </Button>
          </div>
          <Button variant="outline" className="w-full h-12 text-base hover:bg-gray-200 hover:text-black">
            {t.googleLogin[lang]}
          </Button>
        </CardFooter>
      </Card>
    </div>

  )
}

export default SignIn;