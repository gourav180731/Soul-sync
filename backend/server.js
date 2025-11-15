const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// Your Gemini API Key
const API_KEY = "AIzaSyBPbiBd1WQRJnhuV-ByotOgP29g97CxUvA";

// ---------------- MEMORY STORE ----------------
let chatHistory = []; // Stores entire conversation

// ---------------- CHAT ROUTE (AI) ----------------
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("🔥 User Message:", userMessage);

  // Save user message to history
  chatHistory.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  try {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=" +
      API_KEY;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: chatHistory, // 👈 send full conversation
      }),
    });

    const data = await response.json();

    console.log("🔥 FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.json({
        reply: "Gemini API Error: " + data.error.message,
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

    // Save AI reply to history
    chatHistory.push({
      role: "model",
      parts: [{ text: reply }],
    });

    res.json({ reply });
  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    res.json({ reply: "SERVER ERROR: " + err.message });
  }
});

// ---------------- RESET CHAT ROUTE ----------------
app.post("/reset", (req, res) => {
  chatHistory = [];
  console.log("🔄 Chat history reset!");
  res.json({ success: true });
});

// ---------------- START SERVER ----------------
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
