import express from "express";
import path from "path";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// Serve React frontend
app.use(express.static(path.join(__dirname, "public")));

// API endpoint
app.post("/api/gemini-food", async (req, res) => {
  const { age, sex, weight, height, goal, calories } = req.body;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Create a daily meal plan for a ${age}-year-old ${sex}, ${weight}kg, ${height}cm, goal: ${goal}, target calories: ${calories}. Return as a simple bullet list.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const plan = data.candidates?.[0]?.content?.parts?.[0]?.text
      ?.split("\n")
      .filter((line) => line.trim()) || [];

    res.json({ foodPlan: plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Gemini response" });
  }
});

// React fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
