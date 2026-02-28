import { useState, useEffect } from 'react';
import { useGetStudentTestsQuery } from '../../../../services/studentApi';
import { FaClock, FaExclamationCircle, FaPlayCircle, FaHourglassHalf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import Spinner from '../../../comman/Spinner';

const StudentTests = () => {
  const { data, isLoading } = useGetStudentTestsQuery();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(moment()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <Spinner />
    </div>
  );

  const tests = data?.data || [];

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
              Examination <span className="text-orange-600">Portal</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
              Scheduled assessments & real-time results
            </p>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tests.map((test: any) => {
            const testStartTime = moment(test.testDate);
            const joinDeadline = moment(test.testDate).add(5, 'minutes');
            
            // Logic Flags
            const isCompleted = test.isAttempted;
            const isTooEarly = currentTime.isBefore(testStartTime);
            const isWithinWindow = currentTime.isBetween(testStartTime, joinDeadline);

            return (
              <div key={test._id} className={`group bg-white rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl ${isWithinWindow ? 'border-orange-500 scale-[1.03]' : 'border-slate-100 hover:border-orange-200'}`}>
                
                <div className="p-7">
                  <div className="flex justify-between items-start mb-6">
                    {/* Dynamic Status Badge */}
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm
                      ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 
                        isWithinWindow ? 'bg-orange-600 text-white animate-pulse shadow-orange-200' : 
                        isTooEarly ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                      {isCompleted ? '● Completed' : 
                       isTooEarly ? 'Upcoming' : 
                       isWithinWindow ? 'Live: Join Now' : 'Entry Closed'}
                    </span>
                    <span className="text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 tracking-tighter">
                      {test.subjectCode}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 uppercase mb-2 truncate group-hover:text-orange-600 transition-colors">
                    {test.testName}
                  </h3>

                  <div className="flex items-center gap-2 text-slate-400 mt-4">
                    <div className="p-2 bg-slate-50 rounded-lg">
                       <FaClock className="text-xs text-orange-500" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-tight text-slate-600">
                      {testStartTime.format('MMM DD')} <span className="text-slate-300 mx-1">|</span> {testStartTime.format('hh:mm A')}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className={`p-5 px-7 border-t border-slate-50 ${isWithinWindow ? 'bg-orange-50/50' : 'bg-slate-50/30'}`}>
                  
                  {isCompleted ? (
                    <div className="flex justify-between items-center">
                       <div className="flex flex-col">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Score Achieved</span>
                         <span className="text-xl font-black text-emerald-600 tracking-tighter">
                           {test.scoreDetails?.marksScored} <span className="text-slate-300 text-sm italic font-bold">/ {test.maxMarks}</span>
                         </span>
                       </div>
                       <button className="bg-slate-900 hover:bg-orange-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all shadow-lg shadow-slate-200">
                         View Result
                       </button>
                    </div>
                  ) : isTooEarly ? (
                    <div className="flex items-center gap-3 text-blue-500 justify-center py-2.5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                      <FaHourglassHalf className="animate-spin-slow text-xs" />
                      <span className="text-[10px] font-black uppercase tracking-[0.15em]">Portal Opening Soon</span>
                    </div>
                  ) : isWithinWindow ? (
                    <button 
                      onClick={() => navigate(`/student/exam/${test._id}`)}
                      className="w-full bg-orange-600 hover:bg-slate-900 text-white py-4 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-orange-200 group/btn"
                    >
                      <span className="text-[11px] font-black uppercase tracking-widest">Authorize & Start</span>
                      <FaPlayCircle className="group-hover/btn:translate-x-1 transition-transform text-lg" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 text-red-400 justify-center py-3 bg-red-50/50 rounded-2xl border border-red-100/50">
                      <FaExclamationCircle className="text-sm" />
                      <span className="text-[10px] font-black uppercase tracking-widest italic">Deadline Missed</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentTests;