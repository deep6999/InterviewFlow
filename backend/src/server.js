import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../../frontend/dist");

app.get("/book", (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});

// Serve static files from the React app in production
if (ENV.NODE_ENV === "production") {
  app.use(express.static(frontendPath));

  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}
app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});

console.log("NODE_ENV:", ENV.NODE_ENV);