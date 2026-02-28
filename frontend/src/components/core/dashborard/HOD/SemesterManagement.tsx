import React, { useState } from 'react';
import { FaGraduationCap, FaCalendarAlt, FaLayerGroup, FaTimes } from 'react-icons/fa'; // FaSpinner hata diya
import { useCreateSemesterGroupMutation, useGetDepartmentCoursesQuery } from "../../../../services/hodapi";
import { toast } from 'react-hot-toast';
import Spinner from '../../../comman/Spinner';

const SemesterManagement = ({ onBack }: { onBack: () => void }) => {
  // 1. API Hooks
  const { data: coursesResponse } = useGetDepartmentCoursesQuery({}); 
  const [createSemesterGroup, { isLoading: isCreating }] = useCreateSemesterGroupMutation();

  // 2. Form State
  const [formData, setFormData] = useState({
    courseName: '',      
    year: '',            
    semester: '',        
    subjectCodes: ''     
  });

  // 3. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        courseName: formData.courseName,
        year: Number(formData.year),
        semester: Number(formData.semester),
        subjectCodes: formData.subjectCodes
          .split(',')
          .map(code => code.trim())
          .filter(code => code !== "")
      };

      await createSemesterGroup(payload).unwrap();
      toast.success("Semester Group Created!");
      onBack(); 
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid Data");
    }
  };

  return (
    <div className="bg-white w-full max-w-md rounded-[1.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
      
      {/* Modal Header */}
      <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <FaLayerGroup size={14} />
          </div>
          <h1 className="text-sm font-black uppercase tracking-tight">Semester <span className="text-orange-500">Config</span></h1>
        </div>
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
          <FaTimes size={18} />
        </button>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        
        {/* Parent Course */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <FaGraduationCap className="text-orange-500" /> Parent Course
          </label>
          <select 
            required
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all appearance-none"
            value={formData.courseName}
            onChange={(e) => setFormData({...formData, courseName: e.target.value})}
          >
            <option value="">Choose Course...</option>
            {coursesResponse?.data?.map((course: any) => (
              <option key={course._id} value={course.courseName}>{course.courseName}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Year */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FaCalendarAlt className="text-orange-500" /> Batch Year
            </label>
            <input 
              required type="number" placeholder="2024"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
            />
          </div>

          {/* Semester */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FaLayerGroup className="text-orange-500" /> Sem
            </label>
            <input 
              required type="number" placeholder="1"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all"
              value={formData.semester}
              onChange={(e) => setFormData({...formData, semester: e.target.value})}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isCreating}
            className="w-full h-12 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isCreating ? (
              <div className="scale-[0.4]">
                <Spinner />
              </div>
            ) : (
              "Finalize & Save"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SemesterManagement;