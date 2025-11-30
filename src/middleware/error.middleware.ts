import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: unknown,
   _req: Request,
  res: Response,
   _next: NextFunction
) {

  if (err instanceof Error) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    if (err.name === "UnauthorizedError") {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
  res.status(500).json({ error: "Internal server error" });
}
