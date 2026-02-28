
import { Types } from 'mongoose';

import { Course } from "../../models/Course.Model";
import { Request, Response } from "express";
import { SemesterData } from "../../models/Semester.Model";
import {Subject} from "../../models/Subject.Model"
import { Department } from "../../models/Department.Model";

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const createCourse = async (
  req: CustomRequest,
  res: Response,
): Promise<Response> => {
  try {
    let { courseName, durationYears } = req.body;

    if (!courseName || !durationYears || durationYears <= 0) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

  
    const existingCourse = await Course.findOne({ 
      courseName: { $regex: new RegExp(`^${courseName}$`, 'i') } 
    });

    if (existingCourse) {
      return res.status(400).json({ 
        success: false, 
        message: "Course with this name already exists!" 
      });
    }

    const HodId = req.user?.id;
    if (!HodId) {
      return res.status(401).json({
        success: false,
        message: "HOD details not found in request",
      });
    }

    const department = await Department.findOne({ hodId: HodId });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found for this HOD",
      });
    }

    // console.log("department->", department);
    let total_sem = durationYears * 2;

    // . Create New Course
    const newCourse = new Course({
      courseName,
      deptId: department._id,
      durationYears,
      totalSemesters: total_sem,
      students: [],
    });

    const savedCourse = await newCourse.save();

    // console.log("savedCourse->", savedCourse);

    await Department.findByIdAndUpdate(
      department._id,
      { $addToSet: { courses: savedCourse._id } }
    );

    return res.status(200).json({
      success: true,
      message: "Course created and linked to department successfully",
      data: savedCourse,
    });
  } catch (error) {
    console.log("Error in createCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getDepartmentCourses = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    const HodId = req.user?.id;

    if (!HodId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const department = await Department.findOne({ hodId: HodId });

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

   
    const courses = await Course.find({ deptId: department._id }).lean();

    const courseData = courses.map(course => ({
      _id: course._id,
      courseName: course.courseName,
      durationYears: course.durationYears,
      totalSemesters: course.totalSemesters,
      totalStudents: course.students ? course.students.length : 0 // Student count calculate kiya
    }));

    return res.status(200).json({
      success: true,
      departmentName: department.deptName,
      totalCourses: courseData.length,
      data: courseData
    });

  } catch (error: any) {
    console.log("Error in getDepartmentCourses:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




export const createSemesterGroup = async (req: Request, res: Response) => {
  try {
    const { courseName, year, semester, subjectCodes } = req.body;

    
    if (!courseName || !year || !semester) {
      return res.status(400).json({ 
        success: false, 
        message: "Course Name, Year, and Semester are required" 
      });
    }


    const course = await Course.findOne({ 
        courseName: { $regex: new RegExp(`^${courseName}$`, 'i') } 
    });

    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: `Course '${courseName}' not found.` 
      });
    }

   
    const existingGroup = await SemesterData.findOne({ 
        courseId: course._id, 
        year, 
        semester 
    });

    if (existingGroup) {
      return res.status(400).json({ 
        success: false, 
        message: "This semester group already exists" 
      });
    }

 
    let subjectIds: Types.ObjectId[] = [];
    
    if (subjectCodes && Array.isArray(subjectCodes) && subjectCodes.length > 0) {
      
      const foundSubjects = await Subject.find({ 
        subjectCode: { $in: subjectCodes } 
      });

      
      if (foundSubjects.length !== subjectCodes.length) {
        const foundCodes = foundSubjects.map(s => s.subjectCode);
        const missingCodes = subjectCodes.filter(code => !foundCodes.includes(code));
        
        return res.status(404).json({
          success: false,
          message: `Some subject codes are invalid: ${missingCodes.join(", ")}`
        });
      }

      subjectIds = foundSubjects.map(s => s._id as Types.ObjectId);
    }


    const newGroup = new SemesterData({
      courseId: course._id,
      year,
      semester,
      subjects: subjectIds,
      students: [],
    });

    await newGroup.save();

    return res.status(201).json({
      success: true,
      message: "Semester Group created successfully using Subject Codes",
      data: newGroup
    });

  } catch (error: any) {
    console.error("Error in createSemesterGroup:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};


export const getAllSemesterGroups = async (req: Request, res: Response) => {
  try {

    
    const groups = await SemesterData.find({})
      .select('year semester courseId') 
      .populate('courseId', 'courseName') 
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error: any) {
    console.error("Error in getAllSemesterGroups:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};