import type { JwtPayload } from "jsonwebtoken";

// this is for namespace => insert user object into req => req.user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
