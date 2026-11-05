import { Request, Response } from "express";
import { Schedule } from "../../models/ClassSchedule.Model";
import { Subject } from "../../models/Subject.Model";

// Mon / monday / MONDAY, sab ko full naam me badal deta hai
const DAY_MAP: Record<string, string> = {
  mon: "Monday",
  monday: "Monday",
  tue: "Tuesday",
  tues: "Tuesday",
  tuesday: "Tuesday",
  wed: "Wednesday",
  wednesday: "Wednesday",
  thu: "Thursday",
  thur: "Thursday",
  thurs: "Thursday",
  thursday: "Thursday",
  fri: "Friday",
  friday: "Friday",
  sat: "Saturday",
  saturday: "Saturday",
};

const escapeRegex = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const {
      semesterGroupId,
      subjectCode,
      days,
      type,
      startTime,
      endTime,
      roomNumber,
    } = req.body;

    if (
      !semesterGroupId ||
      !subjectCode ||
      !Array.isArray(days) ||
      days.length === 0 ||
      !type ||
      !startTime ||
      !endTime ||
      !roomNumber
    ) {
      return res.status(400).json({
        message: "All fields are required, and 'days' must be a non-empty array.",
      });
    }

    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ message: "End time must be after start time." });
    }

    // Days ko normalize karo (Mon -> Monday, monday -> Monday)
    const mappedDays: (string | undefined)[] = days.map(
      (d: any) => DAY_MAP[String(d).trim().toLowerCase()]
    );

    if (mappedDays.some((d) => !d)) {
      return res.status(400).json({
        message: "Invalid day in 'days'. Use Monday to Saturday.",
      });
    }

    const normalizedDays: string[] = Array.from(
      new Set(mappedDays as string[])
    );

    const cleanCode = String(subjectCode).trim();
    const subjectDoc = await Subject.findOne({
      subjectCode: { $regex: new RegExp(`^${escapeRegex(cleanCode)}$`, "i") },
    });

    if (!subjectDoc) {
      return res
        .status(404)
        .json({ message: "Subject not found with the provided code." });
    }

    if (!subjectDoc.teacherIds) {
      return res.status(400).json({
        message:
          "Is subject ko abhi koi teacher assign nahi hai. Pehle Subjects page se teacher assign karo.",
      });
    }

    const actualTeacherId = subjectDoc.teacherIds.toString();
    const cleanRoom = String(roomNumber).trim();

    // Time overlap: purani class ka start < nayi end AND purani end > nayi start
    const timeOverlap = {
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    };

    const successfulSchedules: any[] = [];
    const conflicts: string[] = [];

    for (const day of normalizedDays) {
      const teacherBusy = await Schedule.findOne({
        teacherId: actualTeacherId,
        day,
        ...timeOverlap,
      });
      if (teacherBusy) {
        conflicts.push(
          `${day}: Teacher is busy in Room ${teacherBusy.roomNumber}`
        );
        continue;
      }

      const classBusy = await Schedule.findOne({
        semesterGroupId,
        day,
        ...timeOverlap,
      });
      if (classBusy) {
        conflicts.push(`${day}: This batch already has a lecture at this time.`);
        continue;
      }

      const roomBusy = await Schedule.findOne({
        roomNumber: cleanRoom,
        day,
        ...timeOverlap,
      });
      if (roomBusy) {
        conflicts.push(`${day}: Room ${cleanRoom} is already occupied.`);
        continue;
      }

      successfulSchedules.push({
        semesterGroupId,
        subjectCode: subjectDoc.subjectCode,
        teacherId: actualTeacherId,
        day,
        type,
        startTime,
        endTime,
        roomNumber: cleanRoom,
      });
    }

    if (successfulSchedules.length === 0) {
      return res.status(400).json({
        message: "Could not create any schedules due to conflicts.",
        errors: conflicts,
      });
    }

    await Schedule.insertMany(successfulSchedules);

    return res.status(201).json({
      message: `Successfully created schedules for ${successfulSchedules.length} days.`,
      conflicts: conflicts.length > 0 ? conflicts : null,
    });
  } catch (error) {
    console.error("Error in createSchedule:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};
