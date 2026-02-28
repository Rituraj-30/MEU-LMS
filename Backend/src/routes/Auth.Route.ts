import { Router } from "express";
import { login ,updatePassword } from "../controllers/Auth.Controller";
import {getUserDetails ,updateUserProfileImage } from "../controllers/Profile.Controlle"
import {authenticateUser } from "../middleware/auth"

const router = Router();



router.post("/login", login);

router.post("/updatePassword", authenticateUser, updatePassword);


router.get("/getUserDetails" ,authenticateUser, getUserDetails)

router.put('/updateUserProfileImage', authenticateUser, updateUserProfileImage);


export default router;