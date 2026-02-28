import React from 'react';
import Spinner from './Spinner';

interface TimetableProps {
  data: any[];
  isLoading: boolean;
  role: 'Staff' | 'Student';
}

const Timetable: React.FC<TimetableProps> = ({ data, isLoading, role }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const scheduleData = data || [];

  const formatTime12h = (timeRange: string) => {
    const convert = (t: string) => {
      if (!t) return "";
      let [h, m] = t.trim().split(':').map(Number);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${m < 10 ? '0' + m : m} ${ampm}`;
    };
    const parts = timeRange.split('to');
    return `${convert(parts[0])} to ${convert(parts[1])}`;
  };

  const timeSlots = Array.from(
    new Set(scheduleData.map((s: any) => `${s.startTime} to ${s.endTime}`))
  ).sort();

  if (isLoading) return (
 <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <Spinner />
      </div>
  );

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      <div className="max-w-[100%] mx-auto">
        
        <div className="mb-6">
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            Class <span className="text-orange-600">Timetable</span>
            <span className="ml-2 text-[9px] bg-slate-200 px-2 py-0.5 rounded text-slate-500 tracking-widest uppercase">{role} View</span>
          </h1>
        </div>

        <div className="bg-white border border-slate-300 shadow-sm overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-3 text-[11px] font-black text-slate-600 uppercase text-center w-28 min-w-[110px]">
                    Time Slot
                  </th>
                  {days.map(day => (
                    <th key={day} className="border border-slate-300 p-3 text-[11px] font-black text-slate-600 uppercase text-center">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot} className="hover:bg-slate-50 transition-colors">
                    <td className="border border-slate-300 p-3 text-[10px] font-bold text-slate-500 text-center bg-slate-50">
                      {formatTime12h(slot)}
                    </td>

                    {days.map((day) => {
                      const lecture = scheduleData.find(
                        (s: any) => s.day === day && `${s.startTime} to ${s.endTime}` === slot
                      );

                      return (
                        <td key={`${day}-${slot}`} className="border border-slate-300 p-2 min-w-[130px] align-top">
                          {lecture ? (
                            <div className="flex flex-col gap-1 text-center">
                              <span className="text-[10px] font-black text-blue-700 leading-tight uppercase">
                                {lecture.subjectCode || lecture.subject} - {lecture.semesterGroupId?.courseId?.courseName || 'Class'}
                              </span>
                              
                              <span className="text-[9px] font-bold text-slate-500 uppercase">
                                {role === 'Student' 
                                  ? `Prof: ${lecture.teacherId?.name || 'Assigned'}` 
                                  : `Batch: ${lecture.semesterGroupId?.semester} Sem`
                                }
                              </span>

                              <span className="text-[9px] font-bold text-green-600 italic">
                                LAB : {lecture.roomNumber}
                              </span>

                              <div className="mt-1">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                                  lecture.type === 'Practical' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                  {lecture.type}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full w-full py-4 text-[9px] text-slate-200 font-bold text-center italic uppercase tracking-widest">
                              -- No Class --
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;