import { Request, Response } from "express";
import { User } from "../models/User.Model";
import { uploadToCloudinary } from "../utils/imgUploder";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}
export const getUserDetails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate("studentDetails.courseId", "name duration")
      .populate("teacherDetails.deptId", "name blockName");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // console.log("user->", user);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error("Error in getUserDetails:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateUserProfileImage = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const files = (req as any).files;
    const profileImage = files?.profileImage;

    // console.log("profileImage->", profileImage);
    const userId = req.user?.id;

    if (!profileImage) {
      return res.status(400).json({
        success: false,
        message: "Profile Image is required",
      });
    }

    const image = await uploadToCloudinary(profileImage, {
      folder: "User",
    });

    const updatedUserDetails = await User.findByIdAndUpdate(
      userId,
      { profileimg: image.secure_url },
      { 
       
        returnDocument: 'after'
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUserDetails,
    });
  } catch (error: any) {
    console.error("Error updating profile image:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
