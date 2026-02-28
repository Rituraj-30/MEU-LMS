
import { Schema, model, Document, Types } from 'mongoose';


export enum UserRole {
  ADMIN = 'Admin',
  HOD = 'Hod',
  TEACHER = 'Staff',
  STUDENT = 'Student'
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent'
}


interface IStudentDetails {
  rollNo: string;
  parentName: string;
  parentContact: string;
  address: string;
  currentYear: number;
  currentSem: number;
  courseName: string;
  semesterGroupId: Types.ObjectId; 
}

interface ITeacherDetails {
  TeacherId: string;
  experience: number;
  specialization: string[];
  designation: string;
  deptId: Types.ObjectId;
  assignedSubjects: Types.ObjectId[]; 
}

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profileimg?: string;
  loginAttempts: number;
  lockUntil?: Date;
  role: UserRole;
  studentDetails?: IStudentDetails; 
  teacherDetails?: ITeacherDetails; 
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileimg: { type: String },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  role: { 
    type: String, 
    enum: Object.values(UserRole), 
    required: true 
  },
  
  studentDetails: {
    rollNo: String,
    parentName: String,
    parentContact: String,
    address: String,
    currentYear: Number,
    currentSem: Number,
    courseName: String,
    semesterGroupId: { type: Schema.Types.ObjectId, ref: 'SemesterGroup' },
  },

  teacherDetails: {
    TeacherId: String,
    experience: Number,
    specialization: [String],
    designation: String,
    deptId: { type: Schema.Types.ObjectId, ref: 'Department' },
    assignedSubjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }]
  }
}, { timestamps: true });

export const User = model<IUser>('User', UserSchema);