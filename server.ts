import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      env: process.env.NODE_ENV || "development",
      hasApiKey: !!process.env.GEMINI_API_KEY
    });
  });

  // Gemini API Proxy
  app.post("/api/gemini", async (req, res) => {
    try {
      const { prompt, isJson, model: modelName = "gemini-3-flash-preview" } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "undefined" || apiKey === "null" || apiKey.trim() === "") {
        return res.status(500).json({ 
          error: "Chưa cấu hình API Key. Vui lòng vào phần 'Settings' (biểu tượng bánh răng) -> 'API Keys' trong AI Studio để chọn một khóa API hợp lệ." 
        });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: isJson ? { responseMimeType: "application/json" } : undefined
      });
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (!text) {
        throw new Error("Không có phản hồi từ AI.");
      }
      
      res.json({ text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      let clientErrorMessage = error.message || "Lỗi máy chủ nội bộ";
      
      // Handle invalid API key specifically
      if (clientErrorMessage.includes("API key not valid") || clientErrorMessage.includes("API_KEY_INVALID")) {
        clientErrorMessage = "API Key không hợp lệ. Vui lòng: \n1. Click vào biểu tượng 'Settings' (bánh răng) ở góc phải.\n2. Chọn 'API Keys'.\n3. Chọn một API Key hợp lệ hoặc tạo mới.";
      } else if (clientErrorMessage.includes("quota")) {
        clientErrorMessage = "Bạn đã hết hạn mức sử dụng (quota). Vui lòng thử lại sau hoặc đổi API Key.";
      }
      
      res.status(500).json({ error: clientErrorMessage });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    // For Express 5, use *all for catch-all
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
