export function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export function methodNotAllowed(res) {
  return sendJson(res, 405, { ok: false, error: "Method Not Allowed" });
}

