import { handleAuth } from "../_shared.js";

export default async function handler(req, res) {
  return handleAuth(req, res);
}

