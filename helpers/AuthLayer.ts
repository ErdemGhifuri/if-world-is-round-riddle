import { Request, Response, NextFunction } from "express";

export const AuthLayer = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeaders = req.headers.authorization;
    if (authHeaders?.replace("Basic ", "") !== process.env.AUTH_HEADER) return res.sendStatus(401);
    else next();
  } catch (error) {
    console.log("error in AuthLayer:", error);
    return res.sendStatus(401);
  }
};
