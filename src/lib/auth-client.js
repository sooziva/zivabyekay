import { createAuthClient } from "better-auth/react";

const envBase = import.meta.env.VITE_AUTH_BASE_URL;
const baseURL = envBase || (typeof window !== "undefined" ? window.location.origin : undefined);

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
});

