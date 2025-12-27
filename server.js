import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

// ----- Fix __dirname in ES Modules -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----- Express Setup -----
const app = express();
const PORT = process.env.PORT || 3000;

// EJS Template Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, "public")));

// Render the chat page
app.get("/", (req, res) => {
  res.render("index");
});

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// ----- WebSocket Setup -----
const wss = new WebSocketServer({ server });

// Keep track of connected clients
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("🔹 New client connected");
  clients.add(ws);

  ws.on("message", (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch (err) {
      console.error("❌ Invalid JSON received:", data);
      return;
    }

    // Optional: Simple validation
    if (!message.name || !message.text) return;

    // Broadcast message to all connected clients
    broadcast(JSON.stringify(message));
  });

  ws.on("close", () => {
    console.log("🔹 Client disconnected");
    clients.delete(ws);
  });

  ws.on("error", (err) => {
    console.error("❌ WebSocket error:", err);
  });
});

// ----- Helper Function to Broadcast Messages -----
function broadcast(message) {
  for (const client of clients) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}

