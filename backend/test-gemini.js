const fetch = require("node-fetch");

const API_KEY = "AIzaSyBPbiBd1WQRJnhuV-ByotOgP29g97CxUvA";

async function testGemini() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: "Hello from Soulsync!" }] }
          ]
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini Response:", data);

  } catch (err) {
    console.error("Error:", err);
  }
}

testGemini();
