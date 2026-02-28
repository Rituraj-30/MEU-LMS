import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetStudentsForAttendanceQuery, 
  useSubmitAttendanceMutation,
  useGetExistingAttendanceQuery 
} from '../../../../services/teacherApi';
import { FaUserCheck, FaUserTimes, FaArrowLeft, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Branded Spinner Import
import Spinner from '../../../comman/Spinner';

const MarkAttendance: React.FC = () => {
  const { scheduleId, groupId } = useParams();
  const navigate = useNavigate();

  const getTodayDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const today = getTodayDate();

  const { data: students, isLoading: loadingStudents } = useGetStudentsForAttendanceQuery(groupId as string);
  const { data: existingData, isLoading: loadingExisting } = useGetExistingAttendanceQuery({ scheduleId, date: today });
  const [submitAttendance, { isLoading: isSubmitting }] = useSubmitAttendanceMutation();

  const [attendanceRecords, setAttendanceRecords] = useState<{studentId: string, status: string}[]>([]);

  useEffect(() => {
    if (students?.data && Array.isArray(students.data)) {
      const dbRecords = existingData?.data || [];
      const mergedData = students.data.map((student: any) => {
        const existingRecord = dbRecords.find((rec: any) => rec.studentId === student._id);
        return {
          studentId: student._id,
          status: existingRecord ? existingRecord.status : 'Absent'
        };
      });
      setAttendanceRecords(mergedData);
    }
  }, [students, existingData]);

  const toggleAttendance = (id: string) => {
    setAttendanceRecords(prev => prev.map(rec => 
      rec.studentId === id ? { ...rec, status: rec.status === 'Present' ? 'Absent' : 'Present' } : rec
    ));
  };

  const handleFinalSubmit = async () => {
    if (attendanceRecords.length === 0) return toast.error("No records found.");
    
    const toastId = toast.loading("Syncing records to cloud...");
    
    try {
      await submitAttendance({
        scheduleId,
        semesterGroupId: groupId,
        date: today,
        attendanceData: attendanceRecords
      }).unwrap();
      
      toast.dismiss(toastId); 
      toast.success("Attendance synced successfully!");
      navigate('/dashboard/teacher/attendance', { replace: true });

    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.data?.message || "Failed to save.");
    }
  };

  const isTrulyLoading = (loadingStudents || loadingExisting) && !students;

  // --- REPLACED FaSpinner WITH BRANDED SPINNER ---
  if (isTrulyLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#f8fafc] gap-6">
        <Spinner />
        <div className="text-center">
           <p className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400">Database Handshake</p>
           <p className="text-[8px] font-bold text-orange-500 uppercase tracking-widest mt-1 italic">Fetching Student Manifest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Control Panel */}
        <div className="flex justify-between items-center mb-10 bg-white p-5 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
          <button onClick={() => navigate(-1)} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-all active:scale-90">
            <FaArrowLeft />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
              Mark <span className="text-orange-600">Attendance</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                 {today}
               </span>
               <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                 {attendanceRecords.filter(r => r.status === 'Present').length} Present
               </span>
            </div>
          </div>

          <button 
            disabled={isSubmitting}
            onClick={handleFinalSubmit}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50 hover:bg-orange-600 transition-all"
          >
            {isSubmitting ? 'Processing...' : 'Sync Cloud'}
          </button>
        </div>

        {/* Student List */}
        <div className="grid gap-4 mb-24">
          {attendanceRecords.map((record) => {
            const studentInfo = students?.data?.find((s: any) => s._id === record.studentId);
            if (!studentInfo) return null;
            const isPresent = record.status === 'Present';

            return (
              <div 
                key={record.studentId}
                onClick={() => toggleAttendance(record.studentId)}
                className={`flex items-center justify-between p-5 bg-white border-2 rounded-[2rem] cursor-pointer transition-all duration-300 select-none ${
                  isPresent ? 'border-emerald-500 shadow-lg shadow-emerald-100 scale-[1.01]' : 'border-slate-100 opacity-60 grayscale-[0.5]'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className="relative">
                    {studentInfo.profileimg ? (
                      <img src={studentInfo.profileimg} className={`w-14 h-14 rounded-[1.2rem] border-2 shadow-sm object-cover transition-colors ${isPresent ? 'border-emerald-500' : 'border-white'}`} alt="pfp" />
                    ) : (
                      <div className="w-14 h-14 rounded-[1.2rem] border-2 border-white bg-slate-50 flex items-center justify-center text-slate-300">
                        <FaUser size={24} />
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-xl border-2 border-white flex items-center justify-center text-[10px] text-white shadow-md transition-all ${isPresent ? 'bg-emerald-500 rotate-0' : 'bg-red-500 rotate-12'}`}>
                      {isPresent ? <FaUserCheck /> : <FaUserTimes />}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{studentInfo?.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Roll No: {studentInfo?.studentDetails?.rollNo}</p>
                  </div>
                </div>

                <div className={`text-[10px] font-black uppercase px-5 py-2.5 rounded-2xl border-2 transition-all ${
                  isPresent ? 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-inner' : 'text-slate-400 bg-slate-50 border-slate-100'
                }`}>
                  {record.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;