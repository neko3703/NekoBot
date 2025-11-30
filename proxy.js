import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all websites
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Proxy Route
app.get("/servers", async (req, res) => {
  try {
    const response = await fetch("https://guild-api.nekocode.in/servers");

    if (!response.ok) {
      return res.status(response.status).json({
        error: true,
        message: `API error: ${response.status}`
      });
    }

    const data = await response.json();
    return res.json(data);

  } catch (err) {
    console.error("Proxy Error:", err.message);

    return res.status(500).json({
      error: true,
      message: "Proxy server failed to fetch API."
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Proxy running on http://localhost:${PORT}`);
});
