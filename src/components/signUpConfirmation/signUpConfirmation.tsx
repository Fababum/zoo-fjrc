import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { TranslationsContext } from "../TranslationsContext";

import { useContext } from "react";

function signUpConfirmation() {
  const context = useContext(TranslationsContext);
  if (!context) return null;
  const { translations, lang } = context;
  const t = translations.signUpConfirmation;
  const langKey = lang as keyof typeof t.title;

  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(255, 248, 235, 0.92), rgba(255, 255, 255, 0.92)), url('/ElephantSquare.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-full max-w-md border border-amber-100/70 bg-white/80 shadow-2xl backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-semibold">
            {t.title[langKey]}
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex flex-col gap-2 pt-2">
          <Button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-full"
          >
            {t.continue[langKey]}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default signUpConfirmation;
