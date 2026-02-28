import express, { type Application, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from "./config/database"
import admin from "./routes/Admin.route"
import Auth from "./routes/Auth.Route"
import HODroutes from "./routes/HOD.routes"
import TeacherRoute from "./routes/Teacher.Route"
import StudentRoute from "./routes/Student.Route"
import {cloudinaryConnect} from "./config/cloudinary"
import fileUpload from "express-fileupload";




dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;


app.use(helmet());
app.use(cors());
app.use(express.json()); 

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp'
  })
);



app.use("/api/v1/user/auth",Auth);
app.use("/api/v1/admin", admin);

app.use("/api/v1/hod", HODroutes);
app.use("/api/v1/teacher", TeacherRoute);
app.use("/api/v1/student", StudentRoute);



app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'LMS Backend is Running with TypeScript! 🚀',
    status: 'Healthy'
  });
});


// Start Server

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      cloudinaryConnect();
     
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server", error);
    process.exit(1);
  });
