import { supabaseAdmin } from "../config/supabase.js"
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email?: string | null };
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.header("Authorization");
  if (!header?.startsWith("Bearer ")) {
    return next(new Error("UnauthorizedError"));
  }

  const token = header.slice(7);
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return next(new Error("UnauthorizedError"));
  }

  req.user = { id: data.user.id, email: data.user.email };
  next();
}