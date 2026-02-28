import React, { useState } from 'react';
import {  FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaLayerGroup } from 'react-icons/fa'; // FaSpinner hata diya
import { 
  useGetAllSubjectsQuery, 
  useCreateSubjectMutation, 
  useEditSubjectMutation 
} from "../../../../services/hodapi"; 
import { toast } from 'react-hot-toast';

import Spinner from '../../../comman/Spinner';


const Subjects = () => {
  const { data: subjectsData, isLoading, refetch } = useGetAllSubjectsQuery({});
  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
  const [editSubject, { isLoading: isEditing }] = useEditSubjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: '',
    credits: 4,
    courseName: '',
    year: '',
    semester: '',
    teacherStringId: '' 
  });

  const handleEditClick = (sub: any) => {
    setEditingId(sub._id);
    setFormData({
      subjectName: sub.subjectName,
      subjectCode: sub.subjectCode,
      credits: sub.credits,
      courseName: sub.semesterInfo?.courseId?.courseName || '',
      year: sub.semesterInfo?.year || '',
      semester: sub.semesterInfo?.semester || '',
      teacherStringId: sub.teacherIds?.teacherDetails?.TeacherId || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ subjectName: '', subjectCode: '', credits: 4, courseName: '', year: '', semester: '', teacherStringId: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await editSubject({ id: editingId, ...formData }).unwrap();
        toast.success("Subject Updated Successfully!");
      } else {
        await createSubject(formData).unwrap();
        toast.success("Subject Created Successfully!");
      }
      closeModal();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const filteredSubjects = subjectsData?.data?.filter((sub: any) => 
    sub.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.subjectCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Subject <span className="text-orange-600">Management</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">Manage your university curriculum and faculty.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <FaPlus /> Add Subject
          </button>
        </div>

        {/* Search & Stats */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search subjects..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 transition-all text-sm font-semibold"
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
            TOTAL: {filteredSubjects?.length || 0}
          </div>
        </div>

        {/* Compact Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject & Code</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Credits</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stream Info</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex justify-center scale-75">
                        <Spinner />
                      </div>
                    </td>
                  </tr>
                ) : filteredSubjects?.map((sub: any) => (
                  <tr key={sub._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">
                          {sub.subjectName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{sub.subjectName}</div>
                          <div className="text-[10px] font-bold text-orange-500 uppercase">{sub.subjectCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black text-slate-700">{sub.credits}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <FaLayerGroup size={10} className="text-slate-400"/> {sub.semesterInfo?.courseId?.courseName || 'N/A'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Y-{sub.semesterInfo?.year} | S-{sub.semesterInfo?.semester}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {sub.teacherIds ? (
                        <div className="flex items-center gap-2">
                          <div className="text-[11px] font-bold text-slate-700">{sub.teacherIds.name}</div>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded">UNASSIGNED</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleEditClick(sub)} className="p-2 text-slate-400 hover:text-orange-600 transition-colors"><FaEdit size={14}/></button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><FaTrash size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- COMPACT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-tight">
                  {editingId ? "Edit" : "Add"} <span className="text-orange-500">Subject</span>
                </h2>
              </div>
              <button onClick={closeModal} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-rose-500 transition-all">
                <FaTimes size={14}/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Subject Name</label>
                    <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none text-sm font-semibold" 
                      placeholder="e.g. Data Structures"
                      value={formData.subjectName} onChange={(e)=>setFormData({...formData, subjectName: e.target.value})} />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Subject Code</label>
                    <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none text-sm font-semibold uppercase" 
                      placeholder="CS101"
                      value={formData.subjectCode} onChange={(e)=>setFormData({...formData, subjectCode: e.target.value})} />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Credits</label>
                    <input type="number" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none text-sm font-semibold" 
                      value={formData.credits} onChange={(e)=>setFormData({...formData, credits: parseInt(e.target.value)})} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Faculty Assignment</label>
                  <input 
                    placeholder="Enter Staff ID (STAFF001)" 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-orange-500 transition-all" 
                    value={formData.teacherStringId} 
                    onChange={(e)=>setFormData({...formData, teacherStringId: e.target.value})} 
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Course</label>
                    <input placeholder="B.TECH" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:border-orange-500 outline-none" 
                      value={formData.courseName} onChange={(e)=>setFormData({...formData, courseName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Year</label>
                    <input placeholder="2024" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-orange-500 outline-none" 
                      value={formData.year} onChange={(e)=>setFormData({...formData, year: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Sem</label>
                    <input placeholder="04" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-orange-500 outline-none" 
                      value={formData.semester} onChange={(e)=>setFormData({...formData, semester: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-xl font-bold text-xs uppercase text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" disabled={isCreating || isEditing} className="flex-[2] h-12 bg-orange-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2">
                  {isCreating || isEditing ? (
                    <div className="scale-[0.4]">
                      <Spinner />
                    </div>
                  ) : (
                    editingId ? "Save Changes" : "Add Subject"
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

export default Subjects;