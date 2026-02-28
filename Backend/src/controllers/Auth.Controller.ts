import { Request, Response } from "express";
import  {User} from "../models/User.Model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface LoginBody {
  email: string;
  password: string;
  MAX_LOGIN_ATTEMPTS: number;
  LOCK_TIME: number;
}


export const login = async (req: Request<{}, {}, LoginBody>, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and Password are required" });
    }

    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (userDoc.lockUntil && userDoc.lockUntil > new Date()) {
      const remainingTime = Math.ceil((userDoc.lockUntil.getTime() - Date.now()) / 60000);
      return res.status(403).json({
        success: false,
        message: `Account locked. Try again after ${remainingTime} minute(s)`,
      });
    }


    const isPasswordMatch = await bcrypt.compare(password, userDoc.password);

    if (!isPasswordMatch) {
      userDoc.loginAttempts += 1;
      
      // Lock for 1 hour after 5 failed attempts
      const LOCK_DURATION = 1 * 60 * 60 * 1000; 

      if (userDoc.loginAttempts >= 5) {
        userDoc.lockUntil = new Date(Date.now() + LOCK_DURATION);
      }

      await userDoc.save();
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // . Reset Attempts on Successful Login
    userDoc.loginAttempts = 0;
    userDoc.lockUntil = undefined; 
    await userDoc.save();

    // JWT Generation
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env file");
    }

    const payload = {
      id: userDoc._id,
      email: userDoc.email,
      role: userDoc.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });


    const userResponse = userDoc.toObject();
    delete (userResponse as any).password;
    delete (userResponse as any).loginAttempts;
    delete (userResponse as any).lockUntil;



    return res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict'
      

    }).status(200).json({
      success: true,
      message: "Welcome back!",
      token,
      user: userResponse,
    });

  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};





export const updatePassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

     const userId = (req as any).user.id;

    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

   

    const isOldPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDoc.password
    );

    if (!isOldPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid old password",
      });
    }


    const isSamePassword = await bcrypt.compare(
      newPassword,
      userDoc.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    userDoc.password = hashedNewPassword;
    await userDoc.save();



//    await mailSender(
//   userDoc.email,                                           
//   "Your password has been updated",                       
//   passwordUpdated(userDoc.email, `${userDoc.firstName}`) 
// );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
    
  } catch (error: any) {
    console.error("Update Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating password",
      error: error.message,
    });
  }
};

