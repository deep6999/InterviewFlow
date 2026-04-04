import express from "express";
import path from "path";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { ENV } from "./lib/env.js";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

const app = express();

//middleware
app.use(express.json());
//cookies middleware to allow cross-origin requests
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
//clerk middleware to protect all routes
app.use(clerkMiddleware());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../../frontend/dist");

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/session", sessionRoutes);

app.get("/book", (req, res) => {
  res.status(200).json({ message: "api running successfully" });
});

// Serve static files from the React app in production
if (ENV.NODE_ENV === "production") {
  app.use(express.static(frontendPath));

  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1); // Exit with failure code
  }
};

startServer();
