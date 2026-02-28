import { Router } from "express";
import { CreateHODAndDepartment } from "../controllers/Admin/department";

const router = Router();


router.post("/CreateHODAndDepartment", CreateHODAndDepartment);

export default router;