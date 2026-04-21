import { toNodeHandler } from "better-auth/node";
import { getAuth, getAuthInitError } from "./_utils/auth.js";
import { sendJson } from "./_utils/http.js";

export default async function handler(req, res) {
  const auth = await getAuth();
  if (!auth) {
    const err = getAuthInitError();
    return sendJson(res, 503, { ok: false, error: err?.message || "Auth service unavailable" });
  }
  return toNodeHandler(auth)(req, res);
}

