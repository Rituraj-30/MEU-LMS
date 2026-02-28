import React from 'react';
import { useGetTeacherSubjectsQuery } from '../../../../services/teacherApi';
import { FaBook, FaIdBadge, FaCloudUploadAlt, FaChevronRight } from 'react-icons/fa';
import Spinner from '../../../comman/Spinner';

const TeacherSubjects: React.FC = () => {
  const { data, isLoading, isError } = useGetTeacherSubjectsQuery();

  // --- REPLACED FaSpinner WITH BRANDED SPINNER ---
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
          Error loading assigned subjects. Please contact system admin.
        </div>
      </div>
    );
  }

  const subjects = data?.data || [];

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-2 uppercase italic">
              Assigned <span className="text-orange-600">Subjects</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Curriculum Management & Resource Upload</p>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Courses: {subjects.length}</span>
          </div>
        </div>

        {/* Subjects Table Layout */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subject Details</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subject Code</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Credit Value</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Resource Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                        <FaBook className="text-slate-200 text-3xl" />
                      </div>
                      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">No subjects assigned to your profile yet</p>
                    </td>
                  </tr>
                ) : (
                  subjects.map((subject: any) => (
                    <tr key={subject._id} className="hover:bg-orange-50/30 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-6">
                            {subject.subjectName?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-slate-800 text-base uppercase tracking-tighter group-hover:text-orange-600 transition-colors">
                              {subject.subjectName}
                            </div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 italic">Academic Module</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="flex items-center gap-2 text-[10px] font-black text-slate-600 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl w-fit group-hover:border-orange-200 transition-colors">
                          <FaIdBadge className="text-orange-500" /> {subject.subjectCode}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-5 py-2 rounded-2xl shadow-sm">
                          {subject.credits} POINTS
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 active:scale-95 inline-flex items-center gap-3 group/btn">
                          <FaCloudUploadAlt size={16} className="group-hover/btn:scale-125 transition-transform" /> 
                          Manage Content 
                          <FaChevronRight className="text-[8px] opacity-30 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSubjects;