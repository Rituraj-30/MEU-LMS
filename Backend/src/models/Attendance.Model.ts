import { Schema, model, Document, Types } from 'mongoose';

interface IAttendance extends Document {
  scheduleId: Types.ObjectId;      
  semesterGroupId: Types.ObjectId; 
  teacherId: Types.ObjectId;     
  date: string;                    
  attendanceRecords: {
    studentId: Types.ObjectId;
    status: 'Present' | 'Absent' | 'Pending';
  }[];
}

const AttendanceSchema = new Schema<IAttendance>({
  scheduleId: { type: Schema.Types.ObjectId, ref: 'Schedule', required: true },
  semesterGroupId: { type: Schema.Types.ObjectId, ref: 'SemesterGroup', required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, 
  attendanceRecords: [{
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Present', 'Absent'], default: 'Absent' }
  }]
}, { timestamps: true });

export const Attendance = model<IAttendance>('Attendance', AttendanceSchema);