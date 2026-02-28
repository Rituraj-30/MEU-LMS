import { Request, Response } from 'express';
import { Schedule } from '../../models/ClassSchedule.Model';
import { SemesterData } from '../../models/Semester.Model';
import { Subject } from "../../models/Subject.Model";
import { Types } from 'mongoose';

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const { semesterGroupId, subjectCode, days, type, startTime, endTime, roomNumber } = req.body;

    if (!semesterGroupId || !subjectCode || !days || !Array.isArray(days) || !type || !startTime || !endTime || !roomNumber) {
      return res.status(400).json({ message: "All fields are required, and 'days' must be an array." });
    }

    const subjectDoc = await Subject.findOne({ subjectCode: subjectCode });
    if (!subjectDoc) {
      return res.status(404).json({ message: "Subject not found with the provided code." });
    }

    const actualTeacherId = subjectDoc.teacherIds.toString();
    const timeOverlap = { $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }] };

    const successfulSchedules = [];
    const conflicts = [];

    for (const day of days) {
      const teacherBusy = await Schedule.findOne({ teacherId: actualTeacherId, day, ...timeOverlap });
      if (teacherBusy) {
        conflicts.push(`${day}: Teacher is busy in Room ${teacherBusy.roomNumber}`);
        continue;
      }

      // Check Class/Batch Conflict or this specific day
      const classBusy = await Schedule.findOne({ semesterGroupId, day, ...timeOverlap });
      if (classBusy) {
        conflicts.push(`${day}: This batch already has a lecture at this time.`);
        continue;
      }

      // Check Room Conflict for this specific day
      const roomBusy = await Schedule.findOne({ roomNumber, day, ...timeOverlap });
      if (roomBusy) {
        conflicts.push(`${day}: Room ${roomNumber} is already occupied.`);
        continue;
      }

      successfulSchedules.push({
        semesterGroupId,
        subjectCode,
        teacherId: actualTeacherId,
        day,
        type,
        startTime,
        endTime,
        roomNumber
      });
    }

    if (successfulSchedules.length === 0) {
      return res.status(400).json({ 
        message: "Could not create any schedules due to conflicts.", 
        errors: conflicts 
      });
    }

    // Bulk Insert
    await Schedule.insertMany(successfulSchedules);

    res.status(201).json({ 
      message: `Successfully created schedules for ${successfulSchedules.length} days.`,
      conflicts: conflicts.length > 0 ? conflicts : null 
    });

  } catch (error) {
    console.error("Error in createSchedule:", error);
    res.status(500).json({ message: "Internal Server Error.", error });
  }
};




// export const markAttendance = async (req: Request, res: Response) => {
//   const { scheduleId, date, attendanceData } = req.body; 
//   // attendanceData = [{ studentId: '...', status: 'Present' }, ...]

//   try {

//       const userId = (req as any).user.id;
//     const attendance = new Attendance({
//       scheduleId,
//       date: new Date(date),
//       records: attendanceData,
//       markedBy: userId 
//     });

//     await attendance.save();
//     res.status(200).json({ message: "Attendance marked successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "Error marking attendance", error });
//   }
// };