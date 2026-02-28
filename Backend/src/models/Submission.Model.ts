import { Schema, model, Document, Types } from 'mongoose';



interface ISubmission extends Document {
  assignmentId: Types.ObjectId;
  studentId: Types.ObjectId;
  submissionFile: string;
  submittedAt: Date;
  marksObtained?: number;
  feedback?: string;
}

const SubmissionSchema = new Schema<ISubmission>({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  submissionFile: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  marksObtained: { type: Number },
  feedback: { type: String }
});

export const Submission = model<ISubmission>('Submission', SubmissionSchema);