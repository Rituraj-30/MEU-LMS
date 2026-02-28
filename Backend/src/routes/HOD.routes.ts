import { Router } from "express";
import {createCourse, getDepartmentCourses ,getAllSemesterGroups,createSemesterGroup} from "../controllers/HOD_Controllers/Course.Controller"
import {createSubject ,getAllSubjects, editSubject} from "../controllers/HOD_Controllers/Subject.Controller"
import {createSchedule} from "../controllers/HOD_Controllers/Schedule.Controller"
import {createStudent,getStudentsByCourse,getAllTeachers ,createTeacher} from "../controllers/HOD_Controllers/HodCreateUser.Controller"
import {authenticateUser , isHOD} from "../middleware/auth"
const router = Router();


router.post("/createCourse", authenticateUser, isHOD,createCourse);

router.get("/getDepartmentCourses", authenticateUser, isHOD,getDepartmentCourses);

router.post("/createSemesterGroup", authenticateUser, isHOD,createSemesterGroup);
router.get("/getAllSemesterGroups", authenticateUser, isHOD,getAllSemesterGroups);

router.post("/createSubject", authenticateUser, isHOD,createSubject);
router.get("/getAllSubjects", authenticateUser, isHOD,getAllSubjects);
router.put("/editSubject/:id", authenticateUser, isHOD, editSubject);




router.post("/createStudent", authenticateUser, isHOD, createStudent);


router.get("/getStudentsByCourse", authenticateUser, isHOD, getStudentsByCourse);


router.post("/createTeacher", authenticateUser, isHOD, createTeacher);
router.get("/getAllTeachers", authenticateUser, isHOD, getAllTeachers);


router.post("/createSchedule", authenticateUser, isHOD, createSchedule);




export default router;
