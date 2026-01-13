import { useState, useRef, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send, Bot, User } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { TranslationsContext } from "../TranslationsContext";
import "./chatbot.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const articlesContext = `
# Verfügbare Tier-Artikel im Zoo

## Elefanten - Die sanften Riesen der Erde
Elefanten gehören zu den beeindruckendsten Lebewesen unseres Planeten. Mit ihrer enormen Größe, ihrer hohen Intelligenz und ihrem ausgeprägten Sozialverhalten faszinieren sie Menschen seit Jahrtausenden.

**Arten:**
- Afrikanischer Savannenelefant (größtes Landsäugetier, über 4m Schulterhöhe, über 6 Tonnen)
- Afrikanischer Waldelefant (kleiner, lebt in Regenwäldern)
- Asiatischer Elefant (kleinere Ohren, nicht alle haben Stoßzähne)

**Besondere Merkmale:**
- Rüssel mit über 40.000 Muskeln
- Stoßzähne (verlängerte Schneidezähne)
- Große Ohren zur Temperaturregulierung
- Können täglich bis zu 150 Liter Wasser trinken und 200kg Nahrung fressen

**Verhalten:**
- Leben in engen Familienverbänden unter Führung einer Matriarchin
- Kommunizieren über Laute, Berührungen und Infraschall
- Zeigen komplexe Emotionen wie Freude, Mitgefühl und Trauer
- Ausgezeichnetes Gedächtnis und Problemlösungsfähigkeiten

**Schutz:**
- Bedroht durch Wilderei, Lebensraumverlust und Konflikte mit Menschen
- Schutzprogramme und Nationalparks sind entscheidend

## Füchse - Die cleveren Anpassungskünstler
Füchse sind unglaublich anpassungsfähig und leben in verschiedensten Lebensräumen. Der Rotfuchs ist in Europa am häufigsten.

**Arten:**
- Rotfuchs (Vulpes vulpes) - am weitesten verbreitet, sehr anpassungsfähig
- Polarfuchs (Vulpes lagopus) - Arktis-Spezialist, wechselt Fellfarbe
- Fennek (Vulpes zerda) - Wüstenfuchs mit großen Ohren

**Besondere Merkmale:**
- Buschiger Schwanz ("Lunte") für Balance, Kommunikation und Wärme
- Spitze Schnauze, ausgezeichneter Geruchs- und Gehörsinn
- "Mäusespringen" - typische Jagdtechnik

**Ernährung:**
- Allesfresser: Nagetiere (besonders Mäuse), Insekten, Würmer, Vögel, Eier, Aas
- Saisonal auch Beeren, Früchte und Fallobst
- Wirken als natürliche Regulatoren von Nagerpopulationen

**Verhalten:**
- Oft einzelgängerisch, aber Familienleben bei Paarung und Aufzucht
- Kommunikation über Laute, Körpersprache und Duftmarken
- Vorsichtig und meiden direkten Menschenkontakt
- Meist dämmerungs- und nachtaktiv

**Fortpflanzung:**
- Paarungszeit im Winter (Januar/Februar)
- Tragzeit ca. 51-54 Tage
- Welpen kommen im Frühling zur Welt (1-10 pro Wurf)

**Zusammenleben mit Menschen:**
- Keine Fütterung
- Müll sicher verschließen
- Hühnerställe fuchssicher bauen
`;

export default function Chatbot() {
  const context = useContext(TranslationsContext);
  if (!context) throw new Error("Chatbot must be used within TranslationsProvider");
  const { translations, lang } = context;
  const t = translations.chatbot;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t.initialMessage[lang as keyof typeof t.initialMessage],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update initial message when language changes
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: t.initialMessage[lang as keyof typeof t.initialMessage],
      },
    ]);
  }, [lang, t.initialMessage]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (!GEMINI_API_KEY) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: t.errorApiKey[lang as keyof typeof t.errorApiKey],
          },
        ]);
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

      const promptTemplate = t.systemPrompt[lang as keyof typeof t.systemPrompt];
      const prompt = promptTemplate
        .replace("{context}", articlesContext)
        .replace("{question}", input);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const assistantMessage = response.text || t.noResponse[lang as keyof typeof t.noResponse];

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t.errorConnection[lang as keyof typeof t.errorConnection],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-background">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            {t.title[lang as keyof typeof t.title]}
          </h1>
          <p className="text-lg text-white drop-shadow-md">
            {t.subtitle[lang as keyof typeof t.subtitle]}
          </p>
        </div>

        <Card className="chatbot-card overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="h-[600px] flex flex-col">
            <CardHeader className="border-b bg-white dark:bg-slate-800">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="h-6 w-6 text-slate-900 dark:text-white" />
                {t.chatAssistant[lang as keyof typeof t.chatAssistant]}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-white dark:bg-slate-800">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-700 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-slate-900 dark:bg-slate-700 text-white"
                        : "bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-slate-600 dark:bg-slate-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-700 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-600 rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <CardFooter className="border-t p-4 bg-white dark:bg-slate-800">
              <div className="flex gap-2 w-full">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t.placeholder[lang as keyof typeof t.placeholder]}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="hover:bg-gray-200 hover:text-black"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </div>
        </Card>

        <div className="mt-4 text-center text-sm text-white drop-shadow-md">
          {t.tip[lang as keyof typeof t.tip]}
        </div>
      </div>
    </div>
  );
}
