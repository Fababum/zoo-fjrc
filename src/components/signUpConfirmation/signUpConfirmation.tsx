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

import { useNavigate } from "react-router-dom";
import { TranslationsContext } from "../TranslationsContext";

import "./signUpConfirmation.css"
import { useContext } from "react";

function signUpConfirmation() {

const { translations, lang } = useContext(TranslationsContext);
          const t = translations?.signUpConfirmation;

  const navigate = useNavigate();

  return (

    <div className="background">
      <Card className="w-full max-w-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 1)'}}>
        <CardHeader className="title">
          <CardTitle className="text-4xl"> {t.title[lang]}</CardTitle>
        </CardHeader>

        <CardFooter className="flex-col gap-2">

            <Button
              type="button"
              onClick={() => navigate("/")}
className="h-12 text-xl bg-black text-white border border-black hover:bg-gray-700 hover:text-white"
            >
             {t.continue[lang]}
            </Button>
        </CardFooter>
      </Card>
    </div>

  )
}

export default signUpConfirmation;