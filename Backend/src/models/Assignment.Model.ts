import { Schema, model, Document, Types } from 'mongoose';

interface IAssignment extends Document {
  title: string;
  topic: string; 
  questions: string[]; 
  fileUrl?: string; 
  deadline: Date;
  totalMarks: number;
  teacherId: Types.ObjectId;
  subjectCode: string;
  semesterGroupId: Types.ObjectId;
}

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  topic: { type: String, required: true },
  questions: [{ type: String }], 
  fileUrl: { type: String },
  deadline: { type: Date, required: true },
  totalMarks: { type: Number, default: 100 },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subjectCode: { type: String, required: true },
  semesterGroupId: { type: Schema.Types.ObjectId, ref: 'SemesterGroup', required: true },
}, { timestamps: true });

export const Assignment = model<IAssignment>('Assignment', AssignmentSchema);