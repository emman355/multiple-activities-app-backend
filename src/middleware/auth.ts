import { supabaseAdmin } from "../config/supabase.js"
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email?: string | null };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("Authorization");
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });

  const token = header.slice(7);
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: "Invalid token" });

  req.user = { id: data.user.id, email: data.user.email };
  next();
}