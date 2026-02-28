import { Router } from "express";
import { authenticateUser, isTeacher } from "../middleware/auth";

import {  getTeacherSubjects,  getTeacherSchedule } from "../controllers/Teacher/Subject.Controller";
import {  createAssignment, createTest} from "../controllers/Teacher/AssignmentAndTest";

import { submitAttendance, getExistingAttendance,getStudentsForAttendance } from "../controllers/Teacher/Attendance.Controller"; 

const router = Router();


router.get("/getTeacherSubjects", authenticateUser, isTeacher, getTeacherSubjects);
router.get("/getTeacherSchedule", authenticateUser, isTeacher, getTeacherSchedule);



router.get("/getStudentsForAttendance/:groupId", authenticateUser, isTeacher, getStudentsForAttendance);
router.get('/get-existing-attendance', authenticateUser, isTeacher, getExistingAttendance);
router.post("/submitAttendance", authenticateUser, isTeacher, submitAttendance);


// createAssignment

router.post("/createAssignment", authenticateUser, isTeacher, createAssignment);

// createTest

router.post("/createTest", authenticateUser, isTeacher, createTest);


export default router;