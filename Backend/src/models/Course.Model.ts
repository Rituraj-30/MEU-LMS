import { Schema, model, Document, Types } from 'mongoose';

interface ICourse extends Document {
  courseName: string;
  deptId: Types.ObjectId;
  durationYears: number;
  totalSemesters: number;
  
  students: Types.ObjectId[]; 
}

const CourseSchema = new Schema<ICourse>({
  courseName: { type: String, required: true },
  deptId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  durationYears: { type: Number, required: true },
  totalSemesters: { type: Number, required: true },
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }] 
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

CourseSchema.virtual('enrolledStudents', {
  ref: 'User',
  localField: '_id',
  foreignField: 'studentDetails.courseId'
});

export const Course = model<ICourse>('Course', CourseSchema);