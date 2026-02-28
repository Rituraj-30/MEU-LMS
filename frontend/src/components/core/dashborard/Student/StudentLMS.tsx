import React from 'react';
import { useGetStudentSubjectsQuery } from '../../../../services/studentApi';
import { FaBook, FaCode, FaDatabase, FaBrain, FaCogs, FaArrowRight } from 'react-icons/fa';
import Spinner from '../../../comman/Spinner';


const StudentLMS: React.FC = () => {
  const { data, isLoading, isError } = useGetStudentSubjectsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8fafc]">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center bg-[#f8fafc] h-screen">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl inline-block font-black uppercase tracking-widest text-[10px] border border-red-100 shadow-sm">
          Error loading your curriculum. Please contact support.
        </div>
      </div>
    );
  }

  const subjects = data?.data || [];
  const academicInfo = {
    course: data?.course?.courseName || "Course",
    semester: data?.semester || 0,
    year: data?.year || 0
  };

  const cardStyles = [
    { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", icon: <FaCode />  },
    { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", icon:  <FaDatabase /> },
    { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", icon: <FaBrain /> },
    { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", icon: <FaBook /> },
    { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", icon: <FaCogs /> },
  ];

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Academic Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
              Learning <span className="text-orange-600">Modules</span>
            </h1>
            <div className="mt-2 flex items-center gap-2">
               <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                 {academicInfo.course}
               </span>
               <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                 Year {academicInfo.year} • Semester {academicInfo.semester}
               </span>
            </div>
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            Total Subjects: {subjects.length}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject: any, index: number) => {
            const style = cardStyles[index % cardStyles.length];
            
            return (
              <div 
                key={subject._id} 
                className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-7 hover:border-orange-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer overflow-hidden"
              >
                {/* Background Decoration */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 ${style.bg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500`} />

                <div className="relative z-10">
                  {/* Icon & Code */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 ${style.bg} ${style.text} rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:rotate-6`}>
                      {style.icon}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 tracking-widest">
                      {subject.subjectCode}
                    </span>
                  </div>

                  {/* Subject Name */}
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-tight mb-2 group-hover:text-orange-600 transition-colors">
                    {subject.subjectName}
                  </h3>

                  {/* Credits & Footer */}
                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {subject.credits} Credits
                      </span>
                    </div>
                    
                    <button className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest group-hover:gap-4 transition-all group-hover:text-orange-600">
                      Explore <FaArrowRight className="text-orange-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {subjects.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <FaBook className="mx-auto text-slate-200 text-6xl mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest">No subjects assigned for this semester.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLMS;