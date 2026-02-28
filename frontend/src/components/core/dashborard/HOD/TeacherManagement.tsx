import React, { useState, useMemo } from 'react';
import { FaPlus, FaSearch, FaTimes, FaIdCard, FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa'; // FaSpinner removed
import { useGetAllTeachersQuery, useCreateTeacherMutation } from "../../../../services/hodapi";
import { toast } from 'react-hot-toast';

import Spinner from '../../../comman/Spinner';


const TeacherManagement = () => {
  // 1. API Hooks
  const { data: teachersResponse, isLoading: loadingTeachers, isError } = useGetAllTeachersQuery({});
  const [createTeacher, { isLoading: isCreating }] = useCreateTeacherMutation();

  // 2. States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    teacherData: {
      designation: '',
      experience: 0,
      specialization: '',
    }
  });

  // 3. Filter Logic (By Name)
  const teachersList = useMemo(() => teachersResponse?.data || [], [teachersResponse]);
  
  const filteredTeachers = teachersList.filter((t: any) => 
    t.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        teacherData: {
          ...formData.teacherData,
          specialization: formData.teacherData.specialization 
            ? formData.teacherData.specialization.split(',').map(s => s.trim()).filter(s => s !== "") 
            : []
        }
      };

      await createTeacher(formattedData).unwrap();
      toast.success("Teacher Account Created!");
      setIsModalOpen(false);
      setFormData({ 
        name: '', email: '', password: '', 
        teacherData: { designation: '', experience: 0, specialization: '' } 
      });
      setShowPassword(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Faculty <span className="text-orange-600">Directory</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Department: <span className="text-slate-900 font-bold">{teachersResponse?.departmentName || "..."}</span>
            </p>
          </div>
          
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg active:scale-95">
            <FaPlus /> Add New Teacher
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 max-w-2xl">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search faculty by name..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm font-semibold shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        {/* Teachers Table Section */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty Info</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Teacher ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingTeachers ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="flex justify-center scale-75">
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr><td colSpan={4} className="py-20 text-center text-red-500 font-bold">Error loading faculty data.</td></tr>
                ) : filteredTeachers.length === 0 ? (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold italic">No teachers found in this department.</td></tr>
                ) : (
                  filteredTeachers.map((teacher: any) => (
                    <tr key={teacher._id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 font-bold border border-slate-200 group-hover:bg-orange-600 group-hover:text-white transition-all">
                            {teacher.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{teacher.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <FaEnvelope className="text-[8px]" /> {teacher.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                          <FaIdCard className="text-slate-300" /> {teacher.teacherDetails?.TeacherId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase rounded-lg border border-orange-100">
                          {teacher.teacherDetails?.designation}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-[10px] font-black text-slate-900 hover:text-orange-600 hover:underline uppercase tracking-tighter">View Profile</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- ADD TEACHER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
              <h2 className="text-lg font-bold uppercase tracking-tight">Register New <span className="text-orange-500">Faculty</span></h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform p-1"><FaTimes /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[75vh]">
              <div className="col-span-2 text-[10px] font-black text-orange-600 uppercase border-b border-slate-100 pb-1 mb-1">Account Credentials</div>
              
              <input required placeholder="Full Name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500" 
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              
              <input required type="email" placeholder="Official Email Address" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500" 
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              
              <div className="relative col-span-1">
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Set Password" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="col-span-2 text-[10px] font-black text-orange-600 uppercase border-b border-slate-100 pb-1 mt-2 mb-1">Professional Details</div>
              
              <input required placeholder="Designation (e.g. Professor)" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500" 
                value={formData.teacherData.designation} onChange={(e) => setFormData({...formData, teacherData: {...formData.teacherData, designation: e.target.value}})} />
              
              <input required type="number" placeholder="Experience (Years)" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500" 
                value={formData.teacherData.experience} onChange={(e) => setFormData({...formData, teacherData: {...formData.teacherData, experience: parseInt(e.target.value) || 0}})} />

              <input placeholder="Specialization (Comma separated: Java, AI, ML)" className="col-span-2 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500" 
                value={formData.teacherData.specialization} onChange={(e) => setFormData({...formData, teacherData: {...formData.teacherData, specialization: e.target.value}})} />

              <div className="col-span-2 flex gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-xs uppercase bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isCreating} className="flex-[2] h-12 bg-orange-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-100">
                  {isCreating ? (
                    <div className="scale-[0.4]">
                      <Spinner />
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;