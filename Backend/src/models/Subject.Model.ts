import { Schema, model, Document, Types } from 'mongoose';

interface ISubject extends Document {
  subjectName: string;
  subjectCode: string;
  credits: number;
  teacherIds: Types.ObjectId; 
  semesterGroupId: Types.ObjectId; 
}

const SubjectSchema = new Schema<ISubject>({
  subjectName: { type: String, required: true },
  subjectCode: { type: String, required: true, unique: true },
  credits: { type: Number, default: 4 },
  teacherIds: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  semesterGroupId: { 
    type: Schema.Types.ObjectId, 
    ref: 'SemesterGroup', 
    required: true 
  }
}, { timestamps: true });

export const Subject = model<ISubject>('Subject', SubjectSchema);