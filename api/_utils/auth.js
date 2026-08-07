import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { Resend } from "resend";
import { buildPasswordResetEmail } from "../../lib/email-templates.js";

let authPromise;
let authInstance = null;
let lastAuthError = null;

const PROD_HOSTS = ["sooziva.com", "www.sooziva.com", "dashboard.sooziva.com"];
const PROD_ORIGINS = [
  "https://sooziva.com",
  "https://www.sooziva.com",
  "https://dashboard.sooziva.com",
];
const DEV_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function isProd() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}

function resolveBaseURL() {
  const fromEnv = (process.env.BETTER_AUTH_URL || "").trim();
  if (!isProd()) {
    return fromEnv || "http://localhost:5173";
  }
  return {
    allowedHosts: PROD_HOSTS,
    protocol: "https",
    fallback: fromEnv || "https://sooziva.com",
  };
}

function resolveTrustedOrigins() {
  const extras = String(process.env.BETTER_AUTH_TRUSTED_ORIGINS || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  return [...new Set([...PROD_ORIGINS, ...DEV_ORIGINS, ...extras])];
}

async function connectMongo(mongoUrl, attempts = 3) {
  let lastError;
  for (let i = 1; i <= attempts; i += 1) {
    const client = new MongoClient(mongoUrl, {
      serverSelectionTimeoutMS: 8000,
    });
    try {
      await client.connect();
      return client;
    } catch (err) {
      lastError = err;
      await client.close().catch(() => {});
      if (i < attempts) {
        await new Promise((r) => setTimeout(r, 400 * i));
      }
    }
  }
  throw lastError || new Error("Failed to connect to MongoDB");
}

async function createAuth() {
  const mongoUrl = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!mongoUrl) {
    throw new Error("Missing MONGODB_URI (or DATABASE_URL) for Better Auth MongoDB adapter");
  }

  const mongoDbName = process.env.MONGODB_DB || "zivabyekay";
  const client = await connectMongo(mongoUrl);
  const db = client.db(mongoDbName);

  return betterAuth({
    baseURL: resolveBaseURL(),
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: resolveTrustedOrigins(),
    ...(isProd()
      ? {
          advanced: {
            crossSubDomainCookies: {
              enabled: true,
              domain: "sooziva.com",
            },
          },
        }
      : {}),
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }, _request) => {
        const apiKey = process.env.RESEND_API_KEY;
        const from = process.env.RESEND_FROM;
        if (!apiKey) throw new Error("Missing RESEND_API_KEY");
        if (!from) throw new Error("Missing RESEND_FROM");

        const email = buildPasswordResetEmail({ resetUrl: url });
        const resend = new Resend(apiKey);

        const { error } = await resend.emails.send({
          from,
          to: [user.email],
          subject: email.subject,
          text: email.text,
          html: email.html,
        });

        if (error) throw new Error(error.message || "Resend error");
      },
    },
    database: mongodbAdapter(db, { client }),
  });
}

export async function getAuth() {
  if (authInstance) return authInstance;
  if (!authPromise) {
    authPromise = createAuth()
      .then((auth) => {
        authInstance = auth;
        lastAuthError = null;
        return auth;
      })
      .catch((err) => {
        lastAuthError = err;
        authPromise = undefined;
        return null;
      });
  }
  return await authPromise;
}

export function getAuthInitError() {
  return lastAuthError;
}
