import { Request, Response } from 'express';
import { Attendance } from '../../models/Attendance.Model';
import { SemesterData } from "../../models/Semester.Model";

export const submitAttendance = async (req: Request, res: Response) => {
  try {
    const { scheduleId, semesterGroupId, date, attendanceData } = req.body;
    const teacherId = (req as any).user?.id;

    if (!scheduleId || !date || !attendanceData) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setUTCHours(0, 0, 0, 0); 

    // Agar scheduleId aur date match hua toh update, nahi toh naya create
    const attendance = await Attendance.findOneAndUpdate(
      { 
        scheduleId: scheduleId, 
        date: attendanceDate 
      }, 
      {
        scheduleId,
        semesterGroupId,
        teacherId,
        date: attendanceDate,
        attendanceRecords: attendanceData 
      },
      { returnDocument: 'after', upsert: true }
    );

    return res.status(200).json({ 
      success: true, 
      message: "Attendance marked successfully!",
      data: attendance 
    });

  } catch (error: any) {
    console.error("Attendance Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    });
  }
};

export const getExistingAttendance = async (req: Request, res: Response) => {
  try {
    const { scheduleId, date } = req.query; 

    const attendanceDate = new Date(date as string);
    attendanceDate.setUTCHours(0, 0, 0, 0);

    const record = await Attendance.findOne({ scheduleId, date: attendanceDate });

    return res.status(200).json({
      success: true,
      data: record ? record.attendanceRecords : []
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const getStudentsForAttendance = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    
    // Students ki details nikalna roll number wise sort karke 
    const groupDetails = await SemesterData.findById(groupId).populate({
      path: 'students',
      select: 'name profileimg studentDetails.rollNo',
      options: { sort: { 'studentDetails.rollNo': 1 } } 
    });

    if (!groupDetails) {
      return res.status(404).json({ 
        success: false, 
        message: "Group not found or no students assigned." 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: groupDetails.students 
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};