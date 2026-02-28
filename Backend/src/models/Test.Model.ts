import { Schema, model, Document, Types } from 'mongoose';

interface IQuestion {
  questionText: string;
  options: string[]; 
  correctAnswer: string; 
}


interface ITest extends Document {
  testName: string;     
  subjectCode: string;     
  groupId: Types.ObjectId;
  testDate: Date; 
  duration: number; 
  maxMarks: number;
  questions: Types.DocumentArray<IQuestion & { _id: Types.ObjectId }>; 
  results: {
    studentId: Types.ObjectId;
    marksScored: number;
    remarks?: string;
  }[];
}


const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }
});

const TestSchema = new Schema<ITest>({
  testName: { type: String, required: true },
  subjectCode: { type: String, required: true },
  groupId: { type: Schema.Types.ObjectId, ref: 'SemesterGroup', required: true },
  testDate: { type: Date, required: true },
  duration: { type: Number, required: true, default: 60 }, 
  maxMarks: { type: Number, required: true },
 
  questions: [QuestionSchema], 

  results: [{
    studentId: { type: Schema.Types.ObjectId, ref: 'User' },
    marksScored: { type: Number, default: 0 },
    remarks: String
  }]
}, { timestamps: true });

export const Test = model<ITest>('Test', TestSchema);