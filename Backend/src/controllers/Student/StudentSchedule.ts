
import { Request, Response } from "express";
import { Schedule } from "../../models/ClassSchedule.Model";
import { User } from "../../models/User.Model";
import { Attendance } from "../../models/Attendance.Model";

export const getStudentSchedule = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; 
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const student = await User.findById(userId).select('studentDetails.semesterGroupId');

    if (!student || !student.studentDetails?.semesterGroupId) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not assigned to any semester group." 
      });
    }

    const groupId = student.studentDetails.semesterGroupId;

    const schedule = await Schedule.find({ semesterGroupId: groupId })
      .populate({
        path: 'teacherId', 
        model: 'User',     
        select: 'name profileimg' 
      })
      .populate({
        path: 'semesterGroupId',
        populate: {
          path: 'courseId',
          select: 'courseName' 
        }
      })
      .sort({ day: 1, startTime: 1 }); 

    return res.status(200).json({ success: true, data: schedule });

  } catch (error: any) {
    console.error("Student Schedule Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const getStudentAttendance = async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user?.id;

    if (!studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const allRecords = await Attendance.find({
      "attendanceRecords.studentId": studentId
    }).populate({
      path: 'scheduleId',
      select: 'subject subjectCode startTime endTime roomNumber' 
    });

    let totalLectures = allRecords.length;
    let totalPresent = 0;
    const subjectWiseData: any = {};

    allRecords.forEach(record => {
      const studentStatus = record.attendanceRecords.find(
        (r: any) => r.studentId.toString() === studentId.toString()
      );

      const isPresent = studentStatus?.status === 'Present';
      if (isPresent) totalPresent++;

      
      // Agar schedule model mein 'subject' field hai toh wahi uthayega
      const subjectName = (record.scheduleId as any)?.subject || 
                          (record.scheduleId as any)?.subjectCode || 
                          "Unknown Subject";

      if (!subjectWiseData[subjectName]) {
        subjectWiseData[subjectName] = { total: 0, present: 0 };
      }

      subjectWiseData[subjectName].total += 1;
      if (isPresent) subjectWiseData[subjectName].present += 1;
    });

    const overallPercentage = totalLectures > 0 ? (totalPresent / totalLectures) * 100 : 0;

    const subjectsArray = Object.keys(subjectWiseData).map(name => ({
      subject: name,
      present: subjectWiseData[name].present,
      total: subjectWiseData[name].total,
      percentage: (subjectWiseData[name].present / subjectWiseData[name].total) * 100
    }));

    return res.status(200).json({
      success: true,
      data: {
        overall: {
          totalLectures,
          totalPresent,
          percentage: overallPercentage.toFixed(2)
        },
        subjects: subjectsArray,
        recentLogs: allRecords.slice(-10).reverse() 
      }
    });

  } catch (error: any) {
    console.error("Attendance Fetch Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};