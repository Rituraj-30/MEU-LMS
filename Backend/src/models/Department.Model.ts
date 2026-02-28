// import { Schema, model, Document, Types } from 'mongoose';

// interface IDepartment extends Document {
//   deptName: string;
//   hodId: Types.ObjectId; 
//   courses: Types.ObjectId[];
//   faculty: Types.ObjectId[];
// }

// const DepartmentSchema = new Schema<IDepartment>({
//   deptName: { type: String, required: true, unique: true },
//   hodId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
//   faculty: [{ type: Schema.Types.ObjectId, ref: 'User' }],
// }, { timestamps: true });

// export const Department = model<IDepartment>('Department', DepartmentSchema);


import { Schema, model, Document, Types } from 'mongoose';

interface IDepartment extends Document {
  deptName: string;
  hodId: Types.ObjectId; 
  courses: Types.ObjectId[];
  faculty: Types.ObjectId[];
}

const DepartmentSchema = new Schema<IDepartment>({
  deptName: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  hodId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  faculty: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export const Department = model<IDepartment>('Department', DepartmentSchema);


// Department.syncIndexes().then(() => {
//     console.log("Department Indexes Synced");
// }).catch(err => {
//     console.error("Index Sync Error:", err);
// });