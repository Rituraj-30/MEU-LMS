import  { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/comman/Navbar";

// Auth Components (Lazy Loaded)
const Login = lazy(() => import("./components/auth/Login"));
const PrivateRoute = lazy(() => import("./components/auth/PrivateRoute"));
const HodRoute = lazy(() => import("./components/auth/HodRoute"));
const StaffRoute = lazy(() => import("./components/auth/StaffRoute"));
const StudentRoute = lazy(() => import("./components/auth/StudentRoute"));
const OpenRoute = lazy(() => import("./components/auth/OpenRoute"));

// Layouts & General (Lazy Loaded)
const Landingpage = lazy(() => import("./pages/LandingPage/Landingpage"));
const Profile = lazy(() => import("./pages/Dashboard/Profile"));
const DashboardLayout = lazy(() => import("./pages/Dashboard/DashboardLayout"));

// HOD Components (Lazy Loaded)
const Subjects = lazy(() => import("./components/core/dashborard/HOD/Subjects"));
const Courses = lazy(() => import("./components/core/dashborard/HOD/Courses"));
const StudentManagement = lazy(() => import("./components/core/dashborard/HOD/StudentManagement"));
const TeacherManagement = lazy(() => import("./components/core/dashborard/HOD/TeacherManagement"));
const SemesterList = lazy(() => import("./components/core/dashborard/HOD/SemesterList"));

// Teacher Components (Lazy Loaded)
const TeacherSubjects = lazy(() => import("./components/core/dashborard/Teacher/TeacherSubjects"));
const TeacherSchedule = lazy(() => import("./components/core/dashborard/Teacher/TeacherSchedule"));
const TodayAttendance = lazy(() => import("./components/core/dashborard/Teacher/TodayAttendance"));
const MarkAttendance = lazy(() => import("./components/core/dashborard/Teacher/MarkAttendance"));
const CreateAssignment = lazy(() => import("./components/core/dashborard/Teacher/CreateAssignment"));
const CreateTest = lazy(() => import("./components/core/dashborard/Teacher/CreateTest"));

// Student Components (Lazy Loaded)
const StudentLMS = lazy(() => import("./components/core/dashborard/Student/StudentLMS"));
const StudentSchedule = lazy(() => import("./components/core/dashborard/Student/StudentSchedule").then(module => ({ default: module.StudentSchedule })));
const StudentAttendance = lazy(() => import("./components/core/dashborard/Student/StudentAttendance"));
const StudentAssignmentList = lazy(() => import("./components/core/dashborard/Student/StudentAssignments"));
const StudentTests = lazy(() => import("./components/core/dashborard/Student/StudentTests"));
const Test = lazy(() => import("./components/core/dashborard/Student/JoinTest"));

// Ek Simple Loading Spinner Component
const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600"></div>
  </div>
);

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <Suspense fallback={<LoadingFallback />}>
      {!isLoginPage && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landingpage />} />
        
        <Route 
          path="/login" 
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          } 
        />

        {/* PROTECTED DASHBOARD ROUTES */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Profile />} />

          {/* HOD ONLY ROUTES */}
          <Route path="hod/subjects" element={<HodRoute><Subjects /></HodRoute>} />
          <Route path="hod/courses" element={<HodRoute><Courses /></HodRoute>} />
          <Route path="hod/students" element={<HodRoute><StudentManagement /></HodRoute>} />
          <Route path="hod/teachers" element={<HodRoute><TeacherManagement /></HodRoute>} />
          <Route path="hod/Setlecture" element={<HodRoute><SemesterList /></HodRoute>} />

          {/* TEACHER / STAFF ROUTES */}
          <Route path="teacher/subjects" element={<StaffRoute><TeacherSubjects /></StaffRoute>} />
          <Route path="teacher/schedule" element={<StaffRoute><TeacherSchedule /></StaffRoute>} />
          <Route path="teacher/attendance" element={<StaffRoute><TodayAttendance /></StaffRoute>} />
          <Route path="teacher/mark-attendance/:scheduleId/:groupId" element={<StaffRoute><MarkAttendance /></StaffRoute>} />
          <Route path="teacher/assignment" element={<StaffRoute><CreateAssignment /></StaffRoute>} />
          <Route path="teacher/test" element={<StaffRoute><CreateTest /></StaffRoute>} />

          {/* STUDENT ROUTES */}
          <Route path="student/LMS" element={<StudentRoute><StudentLMS /></StudentRoute>} />
          <Route path="student/schedule" element={<StudentRoute><StudentSchedule /></StudentRoute>} />
          <Route path="student/attendance" element={<StudentRoute><StudentAttendance /></StudentRoute>} />
          <Route path="student/Assignment" element={<StudentRoute><StudentAssignmentList /></StudentRoute>} />
          <Route path="student/test" element={<StudentRoute><StudentTests /></StudentRoute>} />
        </Route>

        <Route 
          path="student/exam/:testId" 
          element={
            <PrivateRoute>
              <StudentRoute>
                <Test />
              </StudentRoute>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Suspense>
  );
}

export default App;