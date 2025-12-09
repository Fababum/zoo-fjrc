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

import "./signeUP.css"

function SignUp() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const navigate = useNavigate();


  const handleLogin = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Username:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    navigate("/signUpConfirmation")

  };

  return (

    <div className="background">
      <Card className="w-full max-w-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 1)'}}>
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription className="text-base">
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="h-11 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-base">Password</Label>
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
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirmPassword" className="text-base">Confirm Password</Label>
              </div>
              <Input
                id="confirmPassword"
                type="password"
                required
                className="h-12 text-base"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <div className = "login-signeUp">
              <Button onClick={handleLogin} className="w-full h-12 text-base hover:bg-gray-200 hover:text-black">
                create Account
              </Button>
              <Button type="button" onClick={() => navigate("/signIn")} className="w-full h-12 text-base hover:bg-gray-200 hover:text-black">
                signIn
              </Button>
          </div>
          <Button variant="outline" className="w-full h-12 text-base hover:bg-gray-200 hover:text-black">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>

  )
}

export default SignUp;