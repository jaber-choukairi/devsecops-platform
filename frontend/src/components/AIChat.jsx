import { useState } from "react";
import axios from "axios";
import { askAI } from "../services/aiService";

export default function AIChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
        const response = await askAI(question);

        const aiMessage = {
         role: "assistant",
         content: response.answer || JSON.stringify(response)
};


      setMessages((prev) => [...prev, aiMessage]);
      setQuestion("");
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erreur : impossible de contacter l'assistant IA.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Assistant IA DevSecOps
      </h2>

      <div className="h-80 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-500">
            Pose une question sur les vulnérabilités, Kubernetes, Docker ou le pipeline CI/CD.
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-100 text-blue-900"
                : "bg-green-100 text-green-900"
            }`}
          >
            <strong>{msg.role === "user" ? "Toi" : "Assistant IA"} :</strong>
            <p className="mt-1 whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}

        {loading && <p className="text-gray-500">Réponse en cours...</p>}
      </div>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
          placeholder="Ex : Comment corriger une SQL Injection ?"
          className="flex-1 border rounded-lg px-4 py-2"
        />

        <button
          onClick={sendQuestion}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}