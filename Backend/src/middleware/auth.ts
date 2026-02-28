import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string; 
}

interface CustomRequest extends Request {
  user?: CustomJwtPayload;
}

export const authenticateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = 
      req.cookies?.token || 
      req.body?.token || 
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as CustomJwtPayload;
      
      req.user = decoded; 
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const isHOD = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "Hod") {
    return res.status(403).json({
      success: false,
      message: "Access denied. HOD privileges required.",
    });
  }
  next();
};
export const isStudent = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "Student") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Student privileges required.",
    });
  }
  next();
};

export const isTeacher = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "Staff") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Teacher privileges required.",
    });
  }
  next();
};


