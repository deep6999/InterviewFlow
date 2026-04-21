import dotenv from "dotenv";

// load environment variables from .env file
dotenv.config();

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
