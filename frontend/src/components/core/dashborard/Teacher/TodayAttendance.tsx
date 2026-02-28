import React from 'react';
import { useGetTeacherScheduleQuery } from '../../../../services/teacherApi';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaMapMarkerAlt, FaLock, FaPlayCircle, FaCheckCircle, FaGraduationCap } from 'react-icons/fa';
import Spinner from '../../../comman/Spinner';

const TodayAttendance: React.FC = () => {
  const { data, isLoading } = useGetTeacherScheduleQuery();
  const navigate = useNavigate();

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];

  const formatTime12h = (time24: string) => {
    const [hour, min] = time24.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${min < 10 ? '0' + min : min} ${ampm}`;
  };

  const todayLectures = data?.data?.filter((item: any) => item.day === todayName) || [];

  const getClassStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    const [sHour, sMin] = startTime.split(':').map(Number);
    const [eHour, eMin] = endTime.split(':').map(Number);
    const startTotal = sHour * 60 + sMin;
    const endTotal = eHour * 60 + eMin;

    if (currentMin >= startTotal && currentMin <= endTotal) return 'live';
    if (currentMin > endTotal) return 'past';
    return 'upcoming';
  };

  // --- REPLACED FaSpinner WITH BRANDED SPINNER ---
  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      <Spinner />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">
        Loading Daily Schedule...
      </p>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">
              Daily <span className="text-orange-600">Attendance</span>
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
              {todayName} • {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Active Sessions Tracking
             </span>
          </div>
        </div>

        {/* Schedule List */}
        <div className="grid gap-4">
          {todayLectures.length > 0 ? (
            todayLectures.map((lecture: any) => {
              const status = getClassStatus(lecture.startTime, lecture.endTime);
              const courseName = lecture.semesterGroupId?.courseId?.courseName || 'N/A';
              
              return (
                <div 
                  key={lecture._id} 
                  className={`bg-white border rounded-[2rem] p-5 flex flex-col md:flex-row items-center justify-between transition-all duration-500 hover:shadow-xl ${
                    status === 'live' 
                      ? 'border-orange-500 shadow-lg shadow-orange-100 ring-4 ring-orange-500/5' 
                      : 'border-slate-100 opacity-90'
                  }`}
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    {/* Icon Box */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-transform duration-500 ${
                      status === 'live' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-slate-50 text-slate-300 border border-slate-100'
                    }`}>
                      {status === 'past' ? <FaCheckCircle /> : <FaClock />}
                    </div>
                    
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-black text-slate-900 uppercase text-base tracking-tighter">
                          {lecture.subjectCode}
                        </h3>
                        <div className="flex gap-1.5">
                          <span className="flex items-center gap-1 bg-slate-900 text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                            <FaGraduationCap size={10}/> {courseName}
                          </span>
                          <span className={`text-[8px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${
                            lecture.type === 'Theory' ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-purple-600 bg-purple-50 border-purple-100'
                          }`}>
                            {lecture.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 mt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                          <FaClock className="text-orange-500" size={11} /> 
                          {formatTime12h(lecture.startTime)} — {formatTime12h(lecture.endTime)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-orange-500" size={11} /> RM: {lecture.roomNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Area */}
                  <div className="mt-5 md:mt-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                    {status === 'live' ? (
                      <button 
                        onClick={() => navigate(`/dashboard/teacher/mark-attendance/${lecture._id}/${lecture.semesterGroupId._id}`)}
                        className="w-full md:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 group"
                      >
                        <FaPlayCircle size={16} className="group-hover:rotate-12 transition-transform" /> Take Attendance
                      </button>
                    ) : (
                      <div className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 border border-slate-100 italic">
                        {status === 'past' ? (
                          <><FaCheckCircle className="text-emerald-500 shadow-sm" /> Session Ended</>
                        ) : (
                          <><FaLock className="text-slate-300" /> Upcoming</>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <FaLock className="text-slate-200 text-2xl" />
               </div>
               <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[11px]">No academic sessions for today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayAttendance;