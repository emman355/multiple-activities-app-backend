import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

/**
 * Supabase client with service role key.
 * Use this for server-side operations like verifying JWTs.
 * Never expose the service role key to the frontend.
 */
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Supabase client with anon/public key.
 * Useful if you want to call Supabase APIs with limited privileges.
 */
export const supabasePublic = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);