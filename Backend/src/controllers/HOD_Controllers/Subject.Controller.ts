import { Request, Response } from "express";
import {  Types } from 'mongoose';
import { Subject } from "../../models/Subject.Model";
import { SemesterData } from "../../models/Semester.Model"
import { User ,UserRole} from "../../models/User.Model";
import { Course } from "../../models/Course.Model";

export const createSubject = async (req: Request, res: Response) => {
  try {
    const { subjectName, subjectCode, credits, courseName, year, semester, teacherStringId } = req.body;



    if (!subjectName || !subjectCode || !courseName || !year || !semester) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const course = await Course.findOne({ courseName: { $regex: new RegExp(`^${courseName}$`, 'i') } });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const semesterGroup = await SemesterData.findOne({ courseId: course._id, year, semester });
    if (!semesterGroup) return res.status(404).json({ success: false, message: "Semester group not found" });

   let teacherMongoId = null;

   if (teacherStringId) {
        // console.log("teacherStringId->",teacherStringId)

      const teacher = await User.findOne({ 
        "teacherDetails.TeacherId": teacherStringId, 
        role: UserRole.TEACHER 
      });
        //  console.log("teacher->",teacher)


      if (!teacher) {
        return res.status(404).json({ success: false, message: "Teacher with this Staff ID not found" });
      }
      
      teacherMongoId = teacher._id as Types.ObjectId;
    }
//  console.log("teacherMongoId->",teacherMongoId)

    const newSubject = new Subject({
      subjectName,
      subjectCode,
      credits: credits || 4,
      teacherIds: teacherMongoId ,
      semesterGroupId:semesterGroup._id
    });

    const savedSubject = await newSubject.save();

    // console.log(newSubject)
    
    if (teacherMongoId) {
      await User.findByIdAndUpdate(teacherMongoId, {
        $addToSet: { "teacherDetails.assignedSubjects": savedSubject._id }
      });
    }

    //  SemesterData update
    await SemesterData.findByIdAndUpdate(semesterGroup._id, {
      $addToSet: { subjects: savedSubject._id }
    });

    return res.status(201).json({ success: true, message: "Subject created and linked to Teacher!", data: savedSubject });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const editSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const { teacherStringId, ...updateData } = req.body; 

    const subject = await Subject.findById(id);
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });

    let teacherMongoId = subject.teacherIds; 


    if (teacherStringId) {
      const teacher = await User.findOne({ "teacherDetails.TeacherId": teacherStringId });
      if (!teacher) return res.status(404).json({ success: false, message: "Teacher ID invalid hai!" });
      teacherMongoId = teacher._id;
    }

    // update kar do jo data aaya hai
    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { 
        ...updateData, 
        teacherIds: teacherMongoId 
      }, 
      { new: true, runValidators: true }
    );

    if (teacherMongoId) {
      await User.findByIdAndUpdate(teacherMongoId, {
        $addToSet: { "teacherDetails.assignedSubjects": id }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject Updated!",
      data: updatedSubject
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await Subject.find()
      .populate({
        path: 'teacherIds',
        select: 'name email teacherDetails', 
      });

    const subjectsWithDetails = await Promise.all(subjects.map(async (sub) => {

      const semInfo = await SemesterData.findOne({ subjects: sub._id })
        .populate('courseId', 'courseName');
      
      return {
        ...sub.toObject(),
        semesterInfo: semInfo || null
      };
    }));

    // console.log("subjectsWithDetails->", subjectsWithDetails)

    return res.status(200).json({
      success: true,
      data: subjectsWithDetails
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};