import { createAuthClient } from "better-auth/react";

const envBase = import.meta.env.VITE_AUTH_BASE_URL;

// Prefer same-origin in the browser to avoid CORS / www↔apex mismatches.
// Use VITE_AUTH_BASE_URL only for non-browser contexts or explicit overrides.
const baseURL = typeof window !== "undefined" ? window.location.origin : envBase;

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
});

