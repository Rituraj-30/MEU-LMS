import { Request, Response } from "express";
import { SemesterData } from "../../models/Semester.Model"
import { User } from "../../models/User.Model";


export const getLMSSubject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || "699b067bc90aa398edf2fa74";
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }

    const userDoc = await User.findById(userId).select('studentDetails.semesterGroupId');

    if (!userDoc || !userDoc.studentDetails?.semesterGroupId) {
      return res.status(404).json({ 
        success: false, 
        message: "Aapka semester group assign nahi hua hai. HOD se sampark karein." 
      });
    }

    const semesterWithSubjects = await SemesterData.findById(userDoc.studentDetails.semesterGroupId)
      .populate({
        path: 'subjects',
        model: 'Subject', 
        select: 'subjectName subjectCode credits type' 
      })
      .populate({
        path: 'courseId',
        select: 'courseName' 
      });

    if (!semesterWithSubjects) {
      return res.status(404).json({ success: false, message: "Semester data not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Subjects fetched successfully",
      course: semesterWithSubjects.courseId,
      semester: semesterWithSubjects.semester,
      year: semesterWithSubjects.year,
      data: semesterWithSubjects.subjects 
    });

  } catch (error: any) {
    console.error("Error fetching LMS subjects:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};