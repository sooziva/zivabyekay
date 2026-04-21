import { fromNodeHeaders } from "better-auth/node";
import { getAuth, getAuthInitError } from "../_utils/auth.js";
import { methodNotAllowed, sendJson } from "../_utils/http.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res);

  const auth = await getAuth();
  if (!auth) {
    const err = getAuthInitError();
    return sendJson(res, 503, { ok: false, error: err?.message || "Auth service unavailable" });
  }

  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    return sendJson(res, 200, { ok: true, session });
  } catch (err) {
    return sendJson(res, 500, { ok: false, error: err?.message || "Failed to get session" });
  }
}

