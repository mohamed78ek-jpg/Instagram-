import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "TopFollow API" });
  });

  // Server-side Gemini AI helper for Instagram growth advice, hashtags, and bio generation
  app.post("/api/gemini/growth-assistant", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY non configurée dans l'environnement / غير متوفر مفتاح API",
        });
      }

      const { prompt, type, language } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      let systemInstruction = "";
      if (type === "hashtags") {
        systemInstruction = language === "ar" 
          ? "أنت خبير تسويق انستغرام متخصص في استخراج أفضل الهاشتاقات المتفاعلة والنشطة لزيادة المتابعين والوصول. قدم قائمة منظمّة مع شرح موجز لكل هاشتاق."
          : "You are an Instagram viral growth expert specializing in high-performing hashtags for reach and followers. Provide categorized hashtags with expected reach.";
      } else if (type === "bio") {
        systemInstruction = language === "ar"
          ? "أنت مصمم بايو انستغرام محترف. صمم 3 نماذج بايو جذابة مع إيموجيات وتنسيق مميز يناسب حساب زيادة التفاعل والاحترافية."
          : "You are a professional Instagram bio copywriter. Create 3 attractive, emoji-enhanced bios for high engagement.";
      } else {
        systemInstruction = language === "ar"
          ? "أنت مستشار زيادة متابعين وتفاعل انستغرام على منصة توب فلو. أعط نصائح خطة نمو عمليّة وسريعة للحصول على أقصى استفادة من النقاط والمتابعين الحقيقيين."
          : "You are a TopFollow Instagram growth consultant. Provide actionable tips to maximize engagement and follower conversion.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt || "أعطني أفضل 15 هاشتاق انستغرام متفاعل لزيادة المتابعين اليوم",
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ result: response.text });
    } catch (err: any) {
      console.error("Error in Gemini growth assistant:", err);
      res.status(500).json({ error: err.message || "فشل الاتصال بالذكاء الاصطناعي" });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
