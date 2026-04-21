import dotenv from "dotenv";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { Resend } from "resend";
import { buildPasswordResetEmail } from "../lib/email-templates.js";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

let authPromise;
let lastAuthError = null;
let authInstance = null;

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
    baseURL: {
      allowedHosts: ["sooziva.com", "www.sooziva.com", "dashboard.sooziva.com"],
      protocol: "https",
      fallback: "https://sooziva.com",
    },
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: ["https://sooziva.com", "https://www.sooziva.com", "https://dashboard.sooziva.com"],
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
        domain: "sooziva.com",
      },
    },
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

