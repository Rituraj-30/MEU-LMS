import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

// 1. Menu Data ke liye Interface
interface MenuData {
  about: string[];
  academics: string[];
  admissions: string[];
  resources: string[];
  campus: string[];
  facilities: string[];
  placement: string[];
}

const SecondaryNavbar: React.FC = () => {
  // 2. States with Strict Typing
  const [activeDropdown, setActiveDropdown] = useState<keyof MenuData | "contact" | "chancellor" | null>(null);
  const [showFacilities, setShowFacilities] = useState<boolean>(false);

  const menuData: MenuData = {
    about: ["VICE CHANCELLOR’S MESSAGE", "DEAN ACADEMIC’S MESSAGE", "VISION & MISSION", "UNIVERSITY INFO", "IQAC", "IICMU", "CIKS"],
    academics: ["COURSES", "FACULTIES", "CENTRAL LIBRARY", "CORPORATE TRAININGS", "SWAYAM COURSES"],
    admissions: ["ADMISSION SCHEDULE 2025-26", "CANCELLATION POLICY 2025-26", "ADMITTED STUDENT LIST", "APPROVED FEE", "APPLY FOR ADMISSION", "SCHOLARSHIPS & AID", "HOW TO REACH MANDSAUR", "HELPDESK", "ADVERTISEMENTS", "CITY OFFICE"],
    resources: ["EXAMINATION RESULTS", "ACADEMIC CALENDAR", "STUDENT ERP/PORTAL", "E-LIBRARY ACCESS", "PLACEMENT RECORDS"],
    campus: ["HOSTEL & MESS", "TRANSPORTATION", "ANTI-RAGGING CELL", "SPORTS FACILITIES", "GYMNASIUM", "MEDICAL CENTER"],
    facilities: ["HOSTEL & MESS", "TRANSPORTATION", "CAFETERIA", "WIFI CAMPUS", "AUDITORIUM"],
    placement: ["PLACEMENT HIGHLIGHTS", "OUR RECRUITERS", "PLACEMENT STATISTICS", "INTERNSHIPS", "TRAINING & DEVELOPMENT", "ALUMNI SUCCESS"]
  };

  return (
    <nav className="w-full bg-[#2D3748] border-b border-gray-700 shadow-md sticky top-16 z-40 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center justify-center gap-x-8 h-10">
          
          {/* Helper function to render dropdowns to keep code DRY */}
          {(["about", "academics", "resources", "campus", "placement"] as const).map((menu) => (
            <li 
              key={menu}
              className="relative h-full flex items-center" 
              onMouseEnter={() => setActiveDropdown(menu)} 
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`flex items-center gap-1 text-[13px] font-bold transition-colors uppercase tracking-wider ${activeDropdown === menu ? "text-orange-400" : "text-white"}`}>
                {menu} <FaChevronDown size={10} />
              </button>
              {activeDropdown === menu && (
                <ul className="absolute top-full left-0 w-60 bg-[#2D3748] text-white py-1 shadow-2xl rounded-b-md border-t-2 border-orange-500">
                  {menuData[menu].map((item, i) => (
                    <li key={i} className="px-4 py-2 text-[11px] border-b border-gray-600/30 hover:bg-orange-500 transition-all cursor-pointer">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* Special Case: ADMISSIONS (Mega Menu style) */}
          <li 
            className="relative h-full flex items-center" 
            onMouseEnter={() => setActiveDropdown("admissions")} 
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className={`flex items-center gap-1 text-[13px] font-bold transition-colors uppercase tracking-wider ${activeDropdown === "admissions" ? "text-orange-400" : "text-white"}`}>
              Admissions <FaChevronDown size={10} />
            </button>
            {activeDropdown === "admissions" && (
              <ul className="absolute top-full left-[-100px] w-[500px] bg-[#2D3748] text-white p-2 shadow-2xl rounded-b-md grid grid-cols-2 gap-x-2 border-t-2 border-orange-500">
                {menuData.admissions.map((item, i) => (
                  <li key={i} className="px-3 py-2 text-[10px] border-b border-gray-600/20 hover:bg-orange-500 transition-all cursor-pointer uppercase font-medium">
                    {item}
                  </li>
                ))}
                <li 
                  className="relative px-3 py-2 text-[10px] hover:bg-orange-500 transition-all cursor-pointer flex justify-between items-center bg-gray-700/30 font-bold"
                  onMouseEnter={() => setShowFacilities(true)}
                  onMouseLeave={() => setShowFacilities(false)}
                >
                  FACILITIES <FaChevronRight size={8} />
                  {showFacilities && (
                    <ul className="absolute left-full top-0 w-48 bg-[#1a202c] shadow-2xl border-l-2 border-orange-500">
                      {menuData.facilities.map((f, i) => (
                        <li key={i} className="px-4 py-2 text-[10px] border-b border-gray-700 hover:bg-orange-600 transition-all">
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>

          {/* Simple Buttons */}
          <li className="h-full flex items-center">
            <button className="text-[13px] font-bold text-white hover:text-orange-400 transition-colors uppercase tracking-wider">
              Contact Us
            </button>
          </li>
          <li className="h-full flex items-center">
            <button className="text-[13px] font-bold text-white hover:text-orange-400 transition-colors uppercase tracking-wider whitespace-nowrap">
              Chancellor-Brigade
            </button>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default SecondaryNavbar;