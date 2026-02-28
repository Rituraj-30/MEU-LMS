import React from 'react';
import { useGetStudentAttendanceQuery } from '../../../../services/studentApi';
import { useSelector } from 'react-redux'; 
import { FaCheckCircle, FaPercentage, FaClock } from 'react-icons/fa';
import Spinner from '../../../comman/Spinner';

const StudentAttendance: React.FC = () => {
  const { data: response, isLoading } = useGetStudentAttendanceQuery(); 
  const attendance = response?.data;
  
  const { user } = useSelector((state: any) => state.auth);
  const currentUserId = user?._id;

  const formatTime12h = (time: string) => {
    if (!time) return "--:--";
    let [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m < 10 ? '0' + m : m} ${ampm}`;
  };

  const sortedLogs = attendance?.recentLogs ? [...attendance.recentLogs].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateB !== dateA) return dateB - dateA;
    return (b.scheduleId?.startTime || "").localeCompare(a.scheduleId?.startTime || "");
  }) : [];

  if (isLoading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <Spinner />
    </div>
  );

  return (
    <div className="p-3 md:p-5 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-4">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter italic">
            Attendance <span className="text-orange-600">Report</span>
          </h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-time engagement tracking</p>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 transition-transform hover:scale-[1.02]">
            <div className="bg-orange-50 p-3 rounded-xl text-orange-600 shadow-inner"><FaPercentage size={16} /></div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Overall %</p>
              <h2 className="text-lg font-black text-slate-900 leading-none">{attendance?.overall?.percentage}%</h2>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 transition-transform hover:scale-[1.02]">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 shadow-inner"><FaCheckCircle size={16} /></div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Attended</p>
              <h2 className="text-lg font-black text-slate-900 leading-none">
                {attendance?.overall?.totalPresent} 
                <span className="text-[10px] text-slate-400 font-bold ml-1">/ {attendance?.overall?.totalLectures}</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Subject Wise Progress */}
        <div className="mb-8">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 pl-1">Subject Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attendance?.subjects?.map((sub: any) => (
              <div key={sub.subject} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-orange-200 transition-colors group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-black text-slate-700 uppercase truncate pr-2 group-hover:text-orange-600 transition-colors">{sub.subject}</span>
                  <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                    {sub.present}/{sub.total}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-700 ease-out ${sub.percentage >= 75 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]'}`} 
                    style={{ width: `${sub.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Table */}
        <div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 pl-1">Recent Activity</h3>
          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl">
            <div className="max-h-[450px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedLogs.map((log: any) => {
                    const myRecord = log.attendanceRecords.find(
                      (r: any) => r.studentId.toString() === currentUserId?.toString()
                    );
                    const isPresent = myRecord?.status === 'Present';
                    
                    return (
                      <tr key={log._id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-800 italic">
                              {new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <FaClock size={10} className="text-orange-500" /> {formatTime12h(log.scheduleId?.startTime)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-[11px] font-black text-slate-700 uppercase leading-tight tracking-tighter">
                             {log.scheduleId?.subject || log.scheduleId?.subjectCode || "CORE MODULE"}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider ${
                            isPresent ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-rose-100 text-rose-600 border border-rose-200'
                          }`}>
                            {isPresent ? 'Present' : 'Absent'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;