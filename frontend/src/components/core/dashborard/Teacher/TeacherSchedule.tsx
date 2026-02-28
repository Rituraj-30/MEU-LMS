import Timetable from '../../../comman/Timetable';
import { useGetTeacherScheduleQuery } from '../../../../services/teacherApi';

const TeacherSchedule = () => {
  const { data, isLoading } = useGetTeacherScheduleQuery();
  return <Timetable data={data?.data} isLoading={isLoading} role="Staff" />;
};

export default TeacherSchedule;















// import React from 'react';
// import { useGetTeacherScheduleQuery } from '../../../../services/teacherApi';
// import { FaSpinner } from 'react-icons/fa';

// const TeacherSchedule: React.FC = () => {
//   const { data, isLoading, isError } = useGetTeacherScheduleQuery();

//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//   const scheduleData = data?.data || [];

//   // --- BUS YAHAN TIME CONVERT KIYA HAI ---
//   const formatTime12h = (timeRange: string) => {
//     const convert = (t: string) => {
//       let [h, m] = t.trim().split(':').map(Number);
//       const ampm = h >= 12 ? 'PM' : 'AM';
//       h = h % 12 || 12;
//       return `${h}:${m < 10 ? '0' + m : m} ${ampm}`;
//     };
//     const parts = timeRange.split('to');
//     return `${convert(parts[0])} to ${convert(parts[1])}`;
//   };

//   const timeSlots = Array.from(new Set(scheduleData.map((s: any) => `${s.startTime} to ${s.endTime}`))).sort();

//   if (isLoading) return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-4xl text-orange-600" /></div>;

//   return (
//     <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen font-sans">
//       <div className="max-w-[100%] mx-auto">
        
//         <div className="mb-6">
//           <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
//             Class <span className="text-orange-600">Timetable</span>
//           </h1>
//         </div>

//         <div className="bg-white border border-slate-300 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse border border-slate-300">
//               <thead>
//                 <tr className="bg-slate-100">
//                   <th className="border border-slate-300 p-3 text-[11px] font-black text-slate-600 uppercase text-center w-32">
//                     Time Slot
//                   </th>
//                   {days.map(day => (
//                     <th key={day} className="border border-slate-300 p-3 text-[11px] font-black text-slate-600 uppercase text-center">
//                       {day}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {timeSlots.map((slot) => (
//                   <tr key={slot} className="hover:bg-slate-50 transition-colors">
//                     {/* YAHAN BUS DISPLAY TIME CHANGE KIYA HAI */}
//                     <td className="border border-slate-300 p-3 text-[10px] font-bold text-slate-500 text-center bg-slate-50">
//                       {formatTime12h(slot)}
//                     </td>

//                     {days.map((day) => {
//                       const lecture = scheduleData.find(
//                         (s: any) => s.day === day && `${s.startTime} to ${s.endTime}` === slot
//                       );

//                       return (
//                         <td key={`${day}-${slot}`} className="border border-slate-300 p-2 min-w-[150px] align-top">
//                           {lecture ? (
//                             <div className="flex flex-col gap-1 text-center">
//                               <span className="text-[10px] font-black text-blue-700 leading-tight uppercase">
//                                 {lecture.subjectCode} - {lecture.semesterGroupId?.courseId?.courseName || 'Subject'}
//                               </span>
//                               <span className="text-[9px] font-bold text-green-600 italic">
//                                 LAB : {lecture.roomNumber}
//                               </span>
//                               <div className="mt-1">
//                                 <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${lecture.type === 'Practical' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
//                                   {lecture.type}
//                                 </span>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="h-full w-full py-4 text-[9px] text-slate-200 font-bold text-center italic uppercase tracking-widest">
//                               -- No Class --
//                             </div>
//                           )}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherSchedule;