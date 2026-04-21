import { fromNodeHeaders } from "better-auth/node";
import { getAuth, getAuthInitError } from "../../_utils/auth.js";
import { sendJson } from "../../_utils/http.js";

export async function requireDashboardSession(req, res) {
  const auth = await getAuth();
  if (!auth) {
    const err = getAuthInitError();
    sendJson(res, 503, { ok: false, error: err?.message || "Auth service unavailable" });
    return null;
  }

  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) {
    sendJson(res, 401, { ok: false, error: "Unauthorized" });
    return null;
  }

  return session;
}

