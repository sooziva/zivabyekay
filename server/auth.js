import dotenv from "dotenv";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

let authPromise;
let lastAuthError = null;

async function createAuth() {
  const mongoUrl = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!mongoUrl) {
    throw new Error("Missing MONGODB_URI (or DATABASE_URL) for Better Auth MongoDB adapter");
  }

  const mongoDbName = process.env.MONGODB_DB || "zivabyekay";
  const client = new MongoClient(mongoUrl);
  await client.connect();
  const db = client.db(mongoDbName);

  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: { enabled: true },
    database: mongodbAdapter(db, { client }),
  });
}

export async function getAuth() {
  if (!authPromise) {
    authPromise = createAuth().catch((err) => {
      lastAuthError = err;
      return null;
    });
  }
  return await authPromise;
}

export function getAuthInitError() {
  return lastAuthError;
}

