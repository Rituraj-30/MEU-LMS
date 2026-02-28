import { Router } from "express";
import {authenticateUser ,isStudent} from "../middleware/auth"
import { getLMSSubject } from "../controllers/Student/LMS.Controller";
import {getStudentSchedule,getStudentAttendance} from "../controllers/Student/StudentSchedule"
import {getStudentAssignments,submitAssignment,getStudentTests , joinTest,submitTest
}  from "../controllers/Student/AssignmentAndTest"


const router = Router();

router.get('/lms-subjects', authenticateUser, isStudent, getLMSSubject);
router.get('/studentSchedule', authenticateUser, isStudent, getStudentSchedule);
router.get('/studentAttendance', authenticateUser, isStudent, getStudentAttendance);


router.get('/getStudentAssignments', authenticateUser, isStudent, getStudentAssignments);
router.post('/submitAssignment', authenticateUser, isStudent, submitAssignment);

router.get('/getStudentTests', authenticateUser, isStudent, getStudentTests);

router.get('/joinTest/:testId', authenticateUser, isStudent, joinTest);
router.post('/submitTest', authenticateUser, isStudent, submitTest);


export default router;
