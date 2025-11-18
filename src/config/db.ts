import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "./env.js"; // 👈 note the .js extension for ESM

// Create a Postgres client using DATABASE_URL from .env
// Supabase requires SSL, so we set ssl: "require"
export const pg = postgres(env.DATABASE_URL, {
  ssl: "require",
  max: 10 // connection pool size
});

// Wrap the client with Drizzle ORM
export const db = drizzle(pg);