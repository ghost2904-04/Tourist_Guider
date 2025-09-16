import express from "express";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);


app.post("/chat", async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "Missing userId or message" });
  }

  await supabase.from("chats").insert([
    { user_id: userId, role: "user", content: message }
  ]);


  const { data: history } = await supabase
    .from("chats")
    .select("role, content")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });


  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: history
  });

  const botReply = response.choices[0].message.content;


  await supabase.from("chats").insert([
    { user_id: userId, role: "assistant", content: botReply }
  ]);

  res.json({ reply: botReply });
});


app.listen(process.env.PORT, () => {
  console.log(`🚀 Chatbot backend running at http://localhost:${process.env.PORT}`);
});
