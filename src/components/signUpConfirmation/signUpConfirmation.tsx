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

import "./signUpConfirmation.css"

function signUpConfirmation() {

  const navigate = useNavigate();

  return (

    <div className="background">
      <Card className="w-full max-w-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 1)'}}>
        <CardHeader className="title">
          <CardTitle className="text-4xl">Danke fürs Anmelden</CardTitle>
        </CardHeader>

        <CardFooter className="flex-col gap-2">

            <Button
              type="button"
              onClick={() => navigate("/")}
className="h-12 text-xl bg-black text-white border border-black hover:bg-gray-700 hover:text-white"
            >
            weiter
            </Button>
        </CardFooter>
      </Card>
    </div>

  )
}

export default signUpConfirmation;
