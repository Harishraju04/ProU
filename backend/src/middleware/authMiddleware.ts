import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "Unauthenticated Request" });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment!");
      return res.status(500).json({ msg: "Server misconfiguration" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    (req as any).user = decoded.id;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
}
