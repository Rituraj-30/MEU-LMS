
import { Schema, model, Document, Types } from 'mongoose';

interface ISemesterData extends Document {
  courseId: Types.ObjectId;
  year: number;             
  semester: number;       
  subjects: Types.ObjectId[]; 
  students: Types.ObjectId[]; 

}

const SemesterGroup = new Schema<ISemesterData>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
    
});

export const SemesterData = model<ISemesterData>('SemesterGroup', SemesterGroup);