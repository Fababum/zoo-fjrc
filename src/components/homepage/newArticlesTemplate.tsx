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


//import { TranslationsContext } from "../TranslationsContext";

import { useContext } from "react";

import "./newArticlesTemplate.css"


function newArticlesTemplate() {


  const navigate = useNavigate();


  return (

      <Card className="w-full max-w-5xl" style={{ backgroundColor: 'rgba(255, 255, 255, 1)'}} onClick={() => console.log("Test")}>
        <CardHeader>
          <CardTitle className="text-2xl">What’s new?</CardTitle>
          <CardDescription className="text-base">
            Some test about whats new in the zoo.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2">
      <Card className="relative w-full h-[200px] overflow-hidden rounded-xl border-none">
             {/* Background image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1546182990-dffeafbe841d')",
                      }}
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Text content */}
                    <div className="relative z-10 p-4 text-white">
                      <h3 className="text-lg font-semibold leading-tight">
                        fucking title
                      </h3>
                      <p className="text-xs text-white/80 mt-1">
                        What the fuck should I write here
                      </p>
                    </div>

                    {/* Button */}
                    <div className="relative z-10 px-4 pb-4 mt-auto">
                      <Button className="w-full h-11 text-base bg-white text-black hover:bg-gray-200" onClick={() => navigate("/signUp")}>
                        View Page
                      </Button>
                    </div>
                  </Card>
      <Card className="relative w-full h-[200px] overflow-hidden rounded-xl border-none">
                                      {/* Background image */}
                                      <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{
                                          backgroundImage:
                                            "url('https://images.unsplash.com/photo-1546182990-dffeafbe841d')",
                                        }}
                                      />

                                      {/* Dark gradient overlay */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                      {/* Text content */}
                                      <div className="relative z-10 p-4 text-white">
                                        <h3 className="text-lg font-semibold leading-tight">
                                          fucking title
                                        </h3>
                                        <p className="text-xs text-white/80 mt-1">
                                          What the fuck should I write here
                                        </p>
                                      </div>

                                      {/* Button */}
                                      <div className="relative z-10 px-4 pb-4 mt-auto">
                                        <Button className="w-full h-11 text-base bg-white text-black hover:bg-gray-200" onClick={() => navigate("/signUp")}>
                                          View Page
                                        </Button>
                                      </div>
                                    </Card>
      <Card className="relative w-full h-[200px] overflow-hidden rounded-xl border-none">
                                                        {/* Background image */}
                                                        <div
                                                          className="absolute inset-0 bg-cover bg-center"
                                                          style={{
                                                            backgroundImage:
                                                              "url('https://images.unsplash.com/photo-1546182990-dffeafbe841d')",
                                                          }}
                                                        />

                                                        {/* Dark gradient overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                                        {/* Text content */}
                                                        <div className="relative z-10 p-4 text-white">
                                                          <h3 className="text-lg font-semibold leading-tight">
                                                            fucking title
                                                          </h3>
                                                          <p className="text-xs text-white/80 mt-1">
                                                            What the fuck should I write here
                                                          </p>
                                                        </div>

                                                        {/* Button */}
                                                        <div className="relative z-10 px-4 pb-4 mt-auto">
                                                          <Button className="w-full h-11 text-base bg-white text-black hover:bg-gray-200" onClick={() => navigate("/signUp")}>
                                                            View Page
                                                          </Button>
                                                        </div>
                                                      </Card>
                                                      </div>
        </CardContent>
      </Card>

  )
}

export default newArticlesTemplate;
