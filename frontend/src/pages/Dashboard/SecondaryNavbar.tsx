import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { 
  FaBook,  FaChalkboardTeacher, FaGraduationCap,
  FaFileAlt, FaClipboardCheck, FaCalendarAlt, 
  FaTasks, FaFileSignature, FaWallet, FaLaptopCode,
  FaUserGraduate
} from "react-icons/fa";
const SecondaryNavbar: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  if (!token || !user) return null;
  const role = user.role?.toUpperCase(); 

  const getMenuItems = () => {
    switch (role) {
      case "HOD":
        return [
          { name: "Subjects", path: "/dashboard/hod/subjects", icon: <FaBook /> },
          { name: "Courses", path: "/dashboard/hod/courses", icon: <FaGraduationCap /> }, 
          { name: "Set-Lecture", path: "/dashboard/hod/Setlecture", icon: <FaCalendarAlt /> }, 
          { name: "Students", path: "/dashboard/hod/students", icon: <FaUserGraduate /> },
          { name: "Teachers", path: "/dashboard/hod/teachers", icon: <FaChalkboardTeacher /> },
        ];
      case "STAFF":
        return [
          { name: "Schedule", path: "/dashboard/teacher/schedule", icon: <FaCalendarAlt /> }, 
          { name: "My Subjects", path: "/dashboard/teacher/subjects", icon: <FaBook /> },
          { name: "Attendance", path: "/dashboard/teacher/attendance", icon: <FaClipboardCheck /> },
          { name: "Assignment", path: "/dashboard/teacher/assignment", icon: <FaTasks /> }, 
          { name: "Test", path: "/dashboard/teacher/test", icon: <FaFileSignature /> }, 
        ];
      case "STUDENT":
        return [
          { name: "Time-table", path: "/dashboard/student/schedule", icon: <FaCalendarAlt /> },
          { name: "Attendance", path: "/dashboard/student/attendance", icon: <FaClipboardCheck /> },
          { name: "Assignment", path: "/dashboard/student/Assignment", icon: <FaTasks /> },
          { name: "Test", path: "/dashboard/student/test", icon: <FaFileSignature /> },
          { name: "LMS", path: "/dashboard/student/LMS", icon: <FaLaptopCode /> }, 
          { name: "Exams", path: "#", icon: <FaFileAlt /> }, // No path
          { name: "Fee", path: "#", icon: <FaWallet /> },   // No path
        ];
      default: return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="sticky top-19 z-[100] w-full bg-slate-900/95 backdrop-blur-md text-white/80 border-b border-white/5 py-2 px-4 shadow-xl overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <div className="flex-1 flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar">
          {menuItems.map((item) => {
            if (item.path === "#") {
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-not-allowed opacity-50 bg-white/5"
                  title="Coming Soon"
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.name}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap
                  ${isActive 
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-900/40" 
                    : "hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span className="text-sm">{item.icon}</span>
                {item.name}
              </NavLink>
            );
          })}
        </div>

        <div className="hidden sm:flex flex-shrink-0 items-center gap-2 border-l border-white/20 pl-6 ml-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500 whitespace-nowrap">
            {role} Dashboard
          </span>
        </div>

      </div>
    </div>
  );
};

export default SecondaryNavbar;