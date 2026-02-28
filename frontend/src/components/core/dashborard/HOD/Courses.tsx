import React, { useState } from 'react';
import { FaPlus, FaSearch, FaTimes } from 'react-icons/fa'; // FaSpinner yahan se hata diya kyunki ab apna Spinner hai
import { useGetDepartmentCoursesQuery, useCreateCourseMutation } from "../../../../services/hodapi";
import { toast } from 'react-hot-toast';

import Spinner from '../../../comman/Spinner';

const Courses = () => {
  const { data: coursesData, isLoading } = useGetDepartmentCoursesQuery({});
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ courseName: '', durationYears: 3 });

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ courseName: '', durationYears: 3 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCourse(formData).unwrap();
      toast.success("Course Created Successfully!");
      closeModal();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create course");
    }
  };

  const filteredCourses = coursesData?.data?.filter((course: any) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Course <span className="text-orange-600">Management</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium italic">
              {coursesData?.departmentName || "Department"} • Academic Programs
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <FaPlus /> Create New Course
          </button>
        </div>

        <div className="mb-6 max-w-md">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" placeholder="Search courses..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 transition-all text-sm font-semibold shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Course Name</th>
                <th className="px-6 py-4 text-center">Duration</th>
                <th className="px-6 py-4 text-center">Total Semesters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="flex justify-center scale-75">
                       <Spinner />
                    </div>
                  </td>
                </tr>
              ) : filteredCourses?.map((course: any) => (
                <tr key={course._id} className="hover:bg-slate-50/50 transition-all text-sm">
                  <td className="px-6 py-4 font-bold text-slate-800 uppercase">{course.courseName}</td>
                  <td className="px-6 py-4 text-center font-black text-slate-700">{course.durationYears} Years</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[11px] font-black border border-orange-100">
                      {course.durationYears * 2} SEMS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <h2 className="text-lg font-bold uppercase tracking-tight">New <span className="text-orange-500">Course</span></h2>
              <button onClick={closeModal} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-rose-500 transition-all"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 block tracking-wider">Course Name</label>
                <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none text-sm font-bold" value={formData.courseName} onChange={(e) => setFormData({...formData, courseName: e.target.value})} />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 block tracking-wider">Duration</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none text-sm font-bold" value={formData.durationYears} onChange={(e) => setFormData({...formData, durationYears: parseInt(e.target.value)})}>
                  {[1,2,3,4,5].map(y => <option key={y} value={y}>{y} Years</option>)}
                </select>
              </div>
              <button type="submit" disabled={isCreating} className="w-full h-14 bg-orange-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-900 transition-all flex items-center justify-center">
                {isCreating ? (
                  <div className="scale-[0.4]">
                    <Spinner />
                  </div>
                ) : (
                  "Create Course"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;