import { Schema, model, Document, Types } from 'mongoose';

interface ISchedule extends Document {
  semesterGroupId: Types.ObjectId; 
  subjectCode: String;       
  teacherId: String;       
  day: string;                     
  startTime: string;               
  endTime: string;                 
  roomNumber: string;
  type: 'Theory' | 'Practical'; 
}

const ScheduleSchema = new Schema<ISchedule>({
  semesterGroupId: { type: Schema.Types.ObjectId, ref: 'SemesterGroup', required: true },
  subjectCode: { type: String, required: true },
  teacherId: { type: String, required: true },
  day: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 
    required: true 
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  roomNumber: { type: String },
  type: { 
    type: String, 
    enum: ['Theory', 'Practical'], 
    required: true,
    default: 'Theory' 
  }
}, { timestamps: true });

export const Schedule = model<ISchedule>('Schedule', ScheduleSchema);