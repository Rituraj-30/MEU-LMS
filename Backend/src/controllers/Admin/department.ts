import { Request, Response } from "express";
import { Department } from "../../models/Department.Model";
import { User } from "../../models/User.Model";
import bcrypt from "bcryptjs";
import mailSender from "../../utils/mailSender"
import hodWelcomeTemplate from "../../utils/Template/hodWelcomeTemplate";


// Interface for Request Body
export interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  departmentName: string;
}
export const CreateHODAndDepartment = async (req: Request<{}, {}, RegisterBody>, res: Response): Promise<Response> => {
    let savedHODId: any = null; // Rollback ke liye track karenge

    try {
        const { firstName, lastName, email, password, departmentName } = req.body;

        if (!firstName || !lastName || !email || !password || !departmentName) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: `${firstName} ${lastName}`, 
            email,
            password: hashedPassword,
            role: 'Hod', 
            profileimg: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        });
        
        const savedHOD = await newUser.save();
        savedHODId = savedHOD._id; 

        
        const newDept = new Department({
            deptName: departmentName.trim(), 
            hodId: savedHOD._id      
        });
        const savedDept = await newDept.save();

        await User.findByIdAndUpdate(savedHOD._id, {
            $set: {
                teacherDetails: {
                    deptId: savedDept._id,
                    designation: "Head of Department",
                    experience: 0,
                    specialization: [],
                    assignedSubjects: [],
                    TeacherId: `HOD-${Date.now()}` 
                }
            }
        });

    
        const emailBody = hodWelcomeTemplate({
            firstName: savedHOD.name,
            email: savedHOD.email,
            password: password,
            departmentName: savedDept.deptName
        });

      const mail=  await mailSender(savedHOD.email, "Welcome to Your University Portal", emailBody);

    //   console.log("Mail send response:", mail)

        return res.status(201).json({
            success: true,
            message: "HOD and Department created successfully",
            data: { 
                hodName: savedHOD.name, 
                department: savedDept.deptName 
            }
        });

    } catch (err: any) {
        console.error("Error Detail:", err);

     
        if (savedHODId) {
            await User.findByIdAndDelete(savedHODId);
        }

        
        if (err.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "Department name already exists or Index issue!" 
            });
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};