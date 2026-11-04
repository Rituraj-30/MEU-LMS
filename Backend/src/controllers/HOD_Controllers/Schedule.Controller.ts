import { Request, Response } from 'express';
import { Schedule } from '../../models/ClassSchedule.Model';
import { Subject } from "../../models/Subject.Model";

const VALID_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const VALID_TYPES = ["Theory", "Practical"];
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const { semesterGroupId, days, type, startTime, endTime, roomNumber } = req.body;
    const subjectCode = String(req.body.subjectCode || "").trim().toUpperCase();

    if (!semesterGroupId || !subjectCode || !Array.isArray(days) || days.length === 0 || !type || !startTime || !endTime || !roomNumber) {
      return res.status(400).json({ message: "All fields are required, and 'days' must be a non-empty array." });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid lecture type." });
    }
    if (!days.every((d: string) => VALID_DAYS.includes(d))) {
      return res.status(400).json({ message: "Invalid day in 'days'." });
    }
    if (!TIME_REGEX.test(startTime) || !TIME_REGEX.test(endTime) || startTime >= endTime) {
      return res.status(400).json({ message: "Invalid time. Use HH:mm and make sure start is before end." });
    }

    const subjectDoc = await Subject.findOne({ subjectCode });
    if (!subjectDoc) {
      return res.status(404).json({ message: `Subject '${subjectCode}' not found. Check the subject code.` });
    }

    const actualTeacherId = subjectDoc.teacherIds[0]?.toString();
    if (!actualTeacherId) {
      return res.status(400).json({ message: "No teacher is assigned to this subject." });
    }

    const timeOverlap = { startTime: { $lt: endTime }, endTime: { $gt: startTime } };

    const successfulSchedules = [];
    const conflicts: string[] = [];

    for (const day of days) {
      const teacherBusy = await Schedule.findOne({ teacherId: actualTeacherId, day, ...timeOverlap });
      if (teacherBusy) {
        conflicts.push(`${day}: Teacher is busy in Room ${teacherBusy.roomNumber}`);
        continue;
      }

      const classBusy = await Schedule.findOne({ semesterGroupId, day, ...timeOverlap });
      if (classBusy) {
        conflicts.push(`${day}: This batch already has a lecture at this time.`);
        continue;
      }

      const roomBusy = await Schedule.findOne({ roomNumber, day, ...timeOverlap });
      if (roomBusy) {
        conflicts.push(`${day}: Room ${roomNumber} is already occupied.`);
        continue;
      }

      successfulSchedules.push({
        semesterGroupId, subjectCode, teacherId: actualTeacherId,
        day, type, startTime, endTime, roomNumber
      });
    }

    if (successfulSchedules.length === 0) {
      return res.status(400).json({
        message: "Could not create any schedules due to conflicts.",
        errors: conflicts
      });
    }

    await Schedule.insertMany(successfulSchedules);

    return res.status(201).json({
      message: `Successfully created schedules for ${successfulSchedules.length} days.`,
      conflicts: conflicts.length > 0 ? conflicts : null
    });

  } catch (error) {
    console.error("Error in createSchedule:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};
