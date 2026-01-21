import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot } from "lucide-react";

interface SifuChatbotProps {
  analysisData: {
    extracted_skills: string[];
    skill_gaps: any[];
    target_role: string;
    future_proofing_score: number;
  };
}

export function SifuChatbot({ analysisData }: SifuChatbotProps) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "👋 Hey! I'm Sifu, your career mentor. Ask me anything about your skills or career path!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: analysisData
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting. Try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">Ask Sifu 🥋</h3>
      </div>
      
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground ml-12"
                : "bg-muted mr-12"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="bg-muted p-3 rounded-lg mr-12">
            <span className="animate-pulse">Sifu is thinking...</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask Sifu about your career..."
          disabled={loading}
        />
        <Button onClick={sendMessage} disabled={loading || !input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
