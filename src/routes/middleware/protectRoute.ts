import EnvVars from "@src/constants/EnvVars";
import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";

// Extend the Request interface to add a custom 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace 'any' with the actual type of your user data
    }
  }
}

// Middleware to verify JWT
function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: Token is missing" });
  }

  // Extract the token without the "Bearer " prefix
  const token = authHeader.replace(/^Bearer\s+/i, "");

  jwt.verify(
    token,
    EnvVars.Jwt.Secret,
    (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      // Attach the decoded payload to the request object for use in other middleware or routes
      req.user = decoded;
      next();
    }
  );
}

export default verifyJwt;
