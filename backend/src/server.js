import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { ENV } from "./lib/env.js";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

const app = express();
const allowedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

const apiCors = (req, res, next) => {
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const isAllowedOrigin = allowedOrigins.includes(origin);
      const isSameHost = (() => {
        try {
          return new URL(origin).host === req.get("host");
        } catch {
          return false;
        }
      })();

      if (isAllowedOrigin || isSameHost) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })(req, res, next);
};

//middleware
app.use(express.json());
app.use("/api", apiCors);
app.use("/api", clerkMiddleware());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../../frontend/dist");
const frontendIndexPath = path.join(frontendPath, "index.html");

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/session", sessionRoutes);

app.get("/book", (req, res) => {
  res.status(200).json({ message: "api running successfully" });
});

// Serve static files from the React app in production
if (ENV.NODE_ENV === "production") {
  if (fs.existsSync(frontendIndexPath)) {
    app.use(express.static(frontendPath));

    app.get(/^\/(?!api\/).*/, (req, res, next) => {
      // Let asset requests fail with a normal 404 instead of returning HTML.
      if (path.extname(req.path)) {
        return next();
      }

      return res.sendFile(frontendIndexPath);
    });
  } else {
    console.warn(
      `Frontend build not found at ${frontendIndexPath}. Run the frontend build before starting the server in production.`,
    );
  }
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
