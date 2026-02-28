import React, { useState, useMemo } from 'react';
import { FaPlus, FaSearch, FaTimes, FaIdCard, FaEye, FaEyeSlash, FaChevronDown } from 'react-icons/fa'; // FaSpinner hata diya
import { useGetDepartmentCoursesQuery, useCreateStudentMutation, useGetStudentsByCourseQuery } from "../../../../services/hodapi";
import { toast } from 'react-hot-toast';
import Spinner from '../../../comman/Spinner';


const StudentManagement = () => {
  const { data: coursesData } = useGetDepartmentCoursesQuery({});
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { data: studentsResponse, isLoading: loadingStudents, isError } = useGetStudentsByCourseQuery(selectedCourse, {
    skip: !selectedCourse,
  });

  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentData: {
      courseName: '',
      parentName: '',
      parentContact: '', 
      address: '',
      currentYear: 1,
      currentSem: 1,
    }
  });

  const studentsList = useMemo(() => studentsResponse?.data || [], [studentsResponse]);

  const filteredStudents = studentsList.filter((stu: any) => {
    const nameMatch = stu.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const rollMatch = stu.studentDetails?.rollNo?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || rollMatch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStudent(formData).unwrap();
      toast.success("Student Created Successfully!");
      setIsModalOpen(false);
      setFormData({ 
        name: '', email: '', password: '', 
        studentData: { ...formData.studentData, courseName: '', parentName: '', parentContact: '', address: '' } 
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Student <span className="text-orange-600">Enrollment</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">Manage and onboard new students.</p>
          </div>
          
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg active:scale-95">
            <FaPlus /> Add New Student
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1 relative">
            <select 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 font-bold text-sm text-slate-700 shadow-sm appearance-none cursor-pointer"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course to View Students</option>
              {coursesData?.data?.map((c: any) => (
                <option key={c._id} value={c.courseName}>{c.courseName}</option>
              ))}
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
          </div>

          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or roll number..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm font-semibold shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll Number</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingStudents ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="flex justify-center scale-75">
                         <Spinner />
                      </div>
                    </td>
                  </tr>
                ) : !selectedCourse ? (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold italic">Please select a course to view the student list.</td></tr>
                ) : isError ? (
                  <tr><td colSpan={4} className="py-20 text-center text-red-500 font-bold">Error loading students.</td></tr>
                ) : filteredStudents.length === 0 ? (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold">No students found.</td></tr>
                ) : (
                  filteredStudents.map((stu: any) => (
                    <tr key={stu._id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 font-bold border border-orange-100">
                            {stu.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{stu.name}</div>
                            <div className="text-[10px] font-bold text-slate-400">{stu.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                          <FaIdCard className="text-slate-300" /> {stu.studentDetails?.rollNo || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-bold text-slate-600">Year {stu.studentDetails?.currentYear || '-'} | Sem {stu.studentDetails?.currentSem || '-'}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-[10px] font-black text-orange-600 hover:underline">View Details</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- ADD STUDENT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <h2 className="text-lg font-bold uppercase tracking-tight">Enroll New <span className="text-orange-500">Student</span></h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform"><FaTimes /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[80vh]">
              <div className="col-span-2 text-[10px] font-black text-orange-600 uppercase border-b border-slate-100 pb-1 mb-2">Account Details</div>
              
              <input required placeholder="Full Name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500" 
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              
              <input required type="email" placeholder="Email Address" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500" 
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              
              <div className="relative">
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="relative">
                <select 
                  required 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-orange-500 appearance-none cursor-pointer"
                  value={formData.studentData.courseName}
                  onChange={(e) => setFormData({...formData, studentData: {...formData.studentData, courseName: e.target.value}})}
                >
                  <option value="">Select Enrolling Course</option>
                  {coursesData?.data?.map((c: any) => (
                    <option key={c._id} value={c.courseName}>{c.courseName}</option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
              </div>

              <div className="col-span-2 text-[10px] font-black text-orange-600 uppercase border-b border-slate-100 pb-1 mt-4 mb-2">Personal & Academic Info</div>
              
              <input required placeholder="Parent Name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500" 
                value={formData.studentData.parentName} onChange={(e) => setFormData({...formData, studentData: {...formData.studentData, parentName: e.target.value}})} />
              
              <input required type="email" placeholder="Parent Email ID" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500" 
                value={formData.studentData.parentContact} onChange={(e) => setFormData({...formData, studentData: {...formData.studentData, parentContact: e.target.value}})} />

              <div className="grid grid-cols-2 gap-2 col-span-2 md:col-span-1">
                <input required type="number" placeholder="Year" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500" 
                  value={formData.studentData.currentYear} onChange={(e) => setFormData({...formData, studentData: {...formData.studentData, currentYear: parseInt(e.target.value)}})} />
                <input required type="number" placeholder="Sem" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500" 
                  value={formData.studentData.currentSem} onChange={(e) => setFormData({...formData, studentData: {...formData.studentData, currentSem: parseInt(e.target.value)}})} />
              </div>

              <textarea placeholder="Address" className="col-span-2 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-orange-500 h-20" 
                value={formData.studentData.address} onChange={(e) => setFormData({...formData, studentData: {...formData.studentData, address: e.target.value}})} />

              <div className="col-span-2 flex gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-xs uppercase bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isCreating} className="flex-[2] bg-orange-600 text-white py-3 rounded-xl font-bold text-xs uppercase hover:bg-slate-900 transition-all flex items-center justify-center gap-2 min-h-[48px]">
                  {isCreating ? (
                    <div className="scale-[0.4]">
                      <Spinner />
                    </div>
                  ) : (
                    "Enroll Student"
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

export default StudentManagement;