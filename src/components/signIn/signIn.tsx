import { useState, useContext } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/components/AuthContext";
import { ToastViewport, useToast } from "@/components/ui/toast";
import { TranslationsContext } from "../TranslationsContext";

const API_BASE_URL = "/api";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, pushToast, dismissToast } = useToast();

  const navigate = useNavigate();
  const auth = useAuth();
  const context = useContext(TranslationsContext);

  if (!context) return null;

  const { translations, lang } = context;
  const t = translations.signIn;
  const langKey = lang as keyof typeof t.title;

  const handleLogin = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const fallbackMessage =
          response.status === 401 || response.status === 403
            ? "Invalid credentials."
            : "Login failed. Please try again.";
        pushToast(data?.message ?? fallbackMessage, "error");
        return;
      }

      const token =
        data?.access_token ??
        data?.token ??
        data?.accessToken ??
        data?.data?.token ??
        null;
      if (!token) {
        pushToast("Login succeeded but no token was returned.", "error");
        return;
      }

      auth.login(token, data?.user ?? null);
      pushToast("Login erfolgreich.", "success");
      window.setTimeout(() => {
        navigate("/");
      }, 600);
    } catch (err) {
      pushToast("Login failed. Please check your connection.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(255, 248, 235, 0.92), rgba(255, 255, 255, 0.92)), url('/Elephant.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-full max-w-md border border-amber-100/70 bg-white/80 shadow-2xl backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {t.title[langKey]}
          </CardTitle>
          <CardDescription className="text-sm">
            {t.description[langKey]}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">{t.email[langKey]}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder[langKey]}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">{t.password[langKey]}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t.password[langKey]}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-4">
            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : t.loginButton[langKey]}
            </Button>

            <Button
              type="button"
              className="w-full rounded-full"
              disabled={isSubmitting}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 48 48"
                  className="h-4 w-4"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.44 1.44 8.43 3.33l6.2-6.2C34.77 3.2 29.77 1 24 1 14.61 1 6.56 6.45 2.7 14.12l7.4 5.75C12.05 13.14 17.56 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.1 24.5c0-1.55-.14-3.04-.4-4.5H24v9h12.44c-.53 2.87-2.2 5.3-4.67 6.94l7.16 5.56C42.93 37.78 46.1 31.68 46.1 24.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.1 28.12a14.54 14.54 0 0 1 0-8.24l-7.4-5.75A23.94 23.94 0 0 0 1 24c0 3.87.93 7.54 2.7 10.87l7.4-5.75z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 47c5.77 0 10.62-1.9 14.17-5.14l-7.16-5.56c-1.98 1.34-4.5 2.13-7.01 2.13-6.44 0-11.95-3.64-13.9-8.87l-7.4 5.75C6.56 41.55 14.61 47 24 47z"
                  />
                </svg>
              {t.googleLogin[langKey]}
              </span>
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Noch keinen Account?{" "}
              <Button
                type="button"
                variant="link"
                className="h-auto p-0"
                onClick={() => navigate("/signUp")}
                disabled={isSubmitting}
              >
                {t.signUpButton[langKey]}
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default SignIn;
