import { Request, Response } from "express";
import { Schedule } from "../../models/ClassSchedule.Model";
import { Subject } from "../../models/Subject.Model";

// Accepts short or full day names (Mon, monday, MONDAY) and converts them to
// the full name, because the Schedule model stores full day names.
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

const VALID_TYPES = ["Theory", "Practical"];
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

// Escapes special characters so user input can be safely used inside a RegExp.
const escapeRegex = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const { semesterGroupId, days, type, startTime, endTime } = req.body;
    const subjectCode = String(req.body.subjectCode || "").trim();
    const roomNumber = String(req.body.roomNumber || "").trim();

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

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid lecture type." });
    }

    const mappedDays: (string | undefined)[] = days.map(
      (d: any) => DAY_MAP[String(d).trim().toLowerCase()]
    );
    if (mappedDays.some((d) => !d)) {
      return res
        .status(400)
        .json({ message: "Invalid day in 'days'. Use Monday to Saturday." });
    }
    const normalizedDays: string[] = Array.from(new Set(mappedDays as string[]));

    if (
      !TIME_REGEX.test(startTime) ||
      !TIME_REGEX.test(endTime) ||
      startTime >= endTime
    ) {
      return res.status(400).json({
        message: "Invalid time. Use HH:mm and make sure start is before end.",
      });
    }

    const subjectDoc = await Subject.findOne({
      subjectCode: { $regex: new RegExp(`^${escapeRegex(subjectCode)}$`, "i") },
    });
    if (!subjectDoc) {
      return res.status(404).json({
        message: `Subject '${subjectCode}' not found. Check the subject code.`,
      });
    }

    const actualTeacherId = subjectDoc.teacherIds?.toString();
    if (!actualTeacherId) {
      return res.status(400).json({
        message:
          "No teacher is assigned to this subject. Assign a teacher from the Subjects page first.",
      });
    }

    // Two time ranges overlap when the existing start is before the new end
    // and the existing end is after the new start.
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
          `${day}: Teacher is busy in Room ${teacherBusy.roomNumber}.`
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
        roomNumber,
        day,
        ...timeOverlap,
      });
      if (roomBusy) {
        conflicts.push(`${day}: Room ${roomNumber} is already occupied.`);
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
        roomNumber,
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
      message: `Successfully created schedules for ${successfulSchedules.length} day(s).`,
      conflicts: conflicts.length > 0 ? conflicts : null,
    });
  } catch (error) {
    console.error("Error in createSchedule:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};
