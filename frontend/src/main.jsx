import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/react";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log("Using publishable key:", PUBLISHABLE_KEY);

if (!PUBLISHABLE_KEY) {
  throw new Error(
    "Missing publishable key. Please set the VITE_CLERK_PUBLISHABLE_KEY environment variable.",
  );
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontWeight: 700,
              },
            }}
          />
        </ClerkProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
