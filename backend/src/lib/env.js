import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");

// Always load backend/.env, even if the server is started from the repo root.
dotenv.config({ path: envPath });

export const ENV = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLIENT_URL: process.env.CLIENT_URL,
  ONLINE_COMPILER_API_URL:
    process.env.ONLINE_COMPILER_API_URL || "https://api.onlinecompiler.io",
  ONLINE_COMPILER_API_KEY: process.env.ONLINE_COMPILER_API_KEY,
};
