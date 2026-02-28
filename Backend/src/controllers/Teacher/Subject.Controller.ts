import { Request, Response } from "express";
import { Schedule } from "../../models/ClassSchedule.Model";
import {  Types } from 'mongoose';
import { Subject } from "../../models/Subject.Model";
import { SemesterData } from "../../models/Semester.Model"
import { User ,UserRole} from "../../models/User.Model";


import { Course } from "../../models/Course.Model";


export const getTeacherSubjects = async (req: Request, res: Response) => {
  try {


    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }

    const userWithSubjects = await User.findById(userId)
      .select('teacherDetails') 
      .populate({
        path: 'teacherDetails.assignedSubjects',
        model: 'Subject', 
        select: 'subjectName subjectCode credits',
        populate: {
          path: 'teacherIds',
          model: 'User',
          select: 'name email'
        }
      });

    if (!userWithSubjects) {
      return res.status(404).json({ success: false, message: "Teacher record not found." });
    }

    if (!userWithSubjects.teacherDetails || !userWithSubjects.teacherDetails.assignedSubjects) {
      return res.status(200).json({ success: true, data: [], message: "No subjects assigned yet." });
    }

    // console.log("Fetched Teacher Subjects:", userWithSubjects.teacherDetails.assignedSubjects);
    return res.status(200).json({ 
      success: true, 
      count: userWithSubjects.teacherDetails.assignedSubjects.length,
      data: userWithSubjects.teacherDetails.assignedSubjects 
    });

  } catch (error: any) {
    console.error("Error fetching teacher subjects:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error while fetching subjects." });
  }
};






export const getTeacherSchedule = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; 
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const schedule = await Schedule.find({ teacherId: userId })
      .populate({
        path: 'semesterGroupId',
        populate: {
          path: 'courseId',
          select: 'courseName' 
        }
      })
      .sort({ day: 1, startTime: 1 }); 

    if (!schedule || schedule.length === 0) {
      return res.status(200).json({ 
        success: true, 
        data: [], 
        message: "No lectures scheduled yet." 
      });
    }

    // console.log("Fetched Teacher Schedule:", schedule);
    return res.status(200).json({ success: true, data: schedule });

  } catch (error: any) {
    console.error("Schedule Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};