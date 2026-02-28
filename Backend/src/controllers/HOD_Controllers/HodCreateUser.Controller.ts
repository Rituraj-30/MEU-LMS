import { Request, Response } from "express";
import { User, UserRole } from "../../models/User.Model";
import { Course } from "../../models/Course.Model";
import { SemesterData } from "../../models/Semester.Model";
import {Department} from "../../models/Department.Model"
import bcrypt from "bcryptjs";

import mailSender from "../../utils/mailSender"
import studentWelcomeTemplate from "../../utils/Template/StudentWelcomeProps";
import teacherWelcomeTemplate from "../../utils/Template/teacherWelcomeTemplate"

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, password, studentData } = req.body;

    if (!name || !email || !password || !studentData || !studentData.courseName) {
      return res.status(400).json({ success: false, message: "Course Name and all other fields are required" });
    }

    const course = await Course.findOne({ 
      courseName: { $regex: new RegExp(`^${studentData.courseName}$`, 'i') } 
    });
    
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found!" });
    }

    const semesterGroup = await SemesterData.findOne({ 
      courseId: course._id, 
      year: studentData.currentYear, 
      semester: studentData.currentSem 
    });

    if (!semesterGroup) {
      return res.status(404).json({ 
        success: false, 
        message: "Semester Group not found for this Year/Semester. Create it first." 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // roll Number Logic
    let finalRollNo = studentData.rollNo;
    if (!finalRollNo) {
      const count = await User.countDocuments({ role: UserRole.STUDENT });
      finalRollNo = `STU-${new Date().getFullYear()}-${count + 1}`;
    }

    const newStudent = new User({
      name,
      email,
      password: hashedPassword,
      role: UserRole.STUDENT,
      studentDetails: {
        rollNo: finalRollNo,
        parentName: studentData.parentName,
        parentContact: studentData.parentContact,
        address: studentData.address,
        currentYear: studentData.currentYear,
        currentSem: studentData.currentSem,
        courseName: studentData.courseName,
        semesterGroupId: semesterGroup._id, 
      },
    });

    const savedStudent = await newStudent.save();

    await Promise.all([
      Course.findByIdAndUpdate(course._id, { $addToSet: { students: savedStudent._id } }),
      SemesterData.findByIdAndUpdate(semesterGroup._id, { $addToSet: { students: savedStudent._id } })
    ]);

    const emailBody = studentWelcomeTemplate({
      name: savedStudent.name,
      email: savedStudent.email,
      password: password,
      rollNo: savedStudent.studentDetails?.rollNo || finalRollNo,
      courseName: savedStudent.studentDetails?.courseName || studentData.courseName,
      currentYear: savedStudent.studentDetails?.currentYear || studentData.currentYear,
      currentSem: savedStudent.studentDetails?.currentSem || studentData.currentSem,
      parentName: savedStudent.studentDetails?.parentName || studentData.parentName,
      parentContact: savedStudent.studentDetails?.parentContact || studentData.parentContact,
    });

   const mailRes= await mailSender(savedStudent.email, "Welcome to Your University Portal", emailBody);

    // console.log("mail res-> ",mailRes)



    return res.status(201).json({
      success: true,
      message: "Student created and linked successfully",
      student: savedStudent,
    });

  } catch (error: any) {
    console.error("Create Student Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getStudentsByCourse = async (req: Request, res: Response) => {
  try {

    const { courseName } = req.query; 
    // console.log("courseName->", courseName)

    if (!courseName) {
      return res.status(400).json({ success: false, message: "Please provide a course name" });
    }

   
    const courseData = await Course.findOne({ 
      courseName: { $regex: new RegExp(`^${courseName}$`, 'i') } 
    }).populate({
      path: 'students',
   select: 'name email studentDetails role',
      match: { role: 'Student' } 
    });

    if (!courseData) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({
      success: true,
      totalStudents: courseData.students.length,
      course: courseData.courseName,
      data: courseData.students
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




export const createTeacher = async (req: CustomRequest, res: Response) => {
  try {
    const { name, email, password, teacherData } = req.body;

    if (!name || !email || !password || !teacherData) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Teacher with this email already exists",
        });
    }


    
let finalTeacherId = teacherData.TeacherId;
    if (!finalTeacherId) {
     
      const count = await User.countDocuments({ role: UserRole.TEACHER });
      
      finalTeacherId = `TCH-${new Date().getFullYear()}-${count + 1}`;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // console.log(finalTeacherId)
    
    const HodId = req.user?.id;
    if (!HodId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const department = await Department.findOne({ hodId: HodId });
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found for this HOD",
      });
    }

    
    // console.log( department._id)

    const newTeacher = new User({
      name,
      email,
      password: hashedPassword,
      role: UserRole.TEACHER,
      teacherDetails: {
      TeacherId: finalTeacherId,
        experience: teacherData.experience,
        specialization: teacherData.specialization,
        designation: teacherData.designation,
      },
    });

    // console.log("newTeacher",newTeacher)


    const savedTeacher = await newTeacher.save();
        // console.log("savedTeacher",savedTeacher)


  await Department.findByIdAndUpdate(department._id,
      { $push: { faculty: savedTeacher._id } }
    );

    const responseData = savedTeacher.toObject();

    delete (responseData as any).password;
    delete (responseData as any).loginAttempts;

    
    const emailBody = teacherWelcomeTemplate({
      name: savedTeacher.name,
      email: savedTeacher.email,
      password: password,
      designation: savedTeacher.teacherDetails?.designation || teacherData.designation,
      departmentName: department.deptName
      })  

    await mailSender(savedTeacher.email, "Welcome to Your University Portal", emailBody);

    
    return res.status(201).json({
      success: true,
      message: "Teacher account created successfully",
      data: responseData,
    });
  } catch (error: any) {
    console.error("Error in createTeacher:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const getAllTeachers = async (req: CustomRequest, res: Response) => {
  try {
    const HodId = req.user?.id;

    const hodUser = await User.findById(HodId);
    // console.log("hodUser",HodId)

    if (!hodUser || hodUser.role !== UserRole.HOD) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const hodDeptId = hodUser.teacherDetails?.deptId;

    if (!hodDeptId) {
      return res.status(400).json({ success: false, message: "HOD department not found" });
    }

    const departmentWithFaculty = await Department.findById(hodDeptId)
      .populate({
        path: 'faculty',
        select: '-password -loginAttempts', 
        match: { role: UserRole.TEACHER }   
      });

    if (!departmentWithFaculty) {
      return res.status(404).json({ success: false, message: "Department data not found" });
    }
    // console.log("departmentWithFaculty", departmentWithFaculty)

    return res.status(200).json({
      success: true,
      total: departmentWithFaculty.faculty.length,
      departmentName: departmentWithFaculty.deptName,
      data: departmentWithFaculty.faculty, 
    });

  } catch (error: any) {
    console.error("Error in getAllTeachers:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};