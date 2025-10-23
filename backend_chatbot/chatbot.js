import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini + Supabase
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.post("/chat", async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "Missing userId or message" });
  }

  // Save user message to Supabase
  await supabase.from("chats").insert([
    { user_id: userId, role: "user", content: message }
  ]);

  // Fetch chat history
  const { data: history } = await supabase
    .from("chats")
    .select("role, content")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  // Prepare Gemini chat
  let botReply;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage(message); // 👈 use user's latest message
    botReply = result.response.text();

  } catch (err) {
    console.error("❌ Gemini error:", err.message);
    botReply = "⚠️ Sorry, Gemini API is not responding right now.";
  }

  // Save bot reply
  await supabase.from("chats").insert([
    { user_id: userId, role: "assistant", content: botReply }
  ]);

  // Send reply to frontend
  res.json({ reply: botReply });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Chatbot backend running at http://localhost:${process.env.PORT || 3000}`);
});
