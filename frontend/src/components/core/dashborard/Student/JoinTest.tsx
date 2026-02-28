import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJoinTestMutation, useSubmitTestMutation } from '../../../../services/studentApi';
import { FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'; // FaSpinner removed
import toast from 'react-hot-toast';

import Spinner from '../../../comman/Spinner';


const Test = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [joinTest, { data: res, isLoading, isError, error }] = useJoinTestMutation();
  const [submitTest, { isLoading: isSubmitting }] = useSubmitTestMutation();

  const [visibleIdx, setVisibleIdx] = useState(0); 
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExamFinished, setIsExamFinished] = useState(false);

  useEffect(() => {
    if (testId) joinTest(testId).unwrap().catch(e => console.error(e));
  }, [testId, joinTest]);

  const finalSubmit = useCallback(async (auto = false) => {
    if (isExamFinished) return;
    try {
      setIsExamFinished(true);
      await submitTest({ testId: testId!, answers }).unwrap();
      toast.success(auto ? "Time up! Submitted." : "Test submitted successfully!");
      navigate('/dashboard/student/test', { replace: true });
    } catch (err: any) {
      toast.error(err.data?.message || "Submission failed!");
      setIsExamFinished(false);
    }
  }, [testId, answers, navigate, submitTest, isExamFinished]);

  useEffect(() => {
    if (res?.data?.endTime) {
      const timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((new Date(res.data.endTime).getTime() - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) { clearInterval(timer); if (!isExamFinished) finalSubmit(true); }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [res, finalSubmit, isExamFinished]);

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Spinner />
    </div>
  );

  if (isError) return (
    <div className="h-screen flex flex-col items-center justify-center p-4 text-center bg-[#f8fafc]">
      <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
        <FaExclamationTriangle className="text-orange-500 text-3xl" />
      </div>
      <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Access <span className="text-orange-600">Denied</span></h2>
      <p className="text-slate-400 font-bold text-xs mt-1 max-w-xs uppercase tracking-widest">
        {(error as any)?.data?.message || "Something went wrong"}
      </p>
      <button 
        onClick={() => navigate('/dashboard/student/test')}
        className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg"
      >
        Go Back To Dashboard
      </button>
    </div>
  );

  const questions = res?.data?.questions || [];
  const visibleQuestions = questions.slice(visibleIdx, visibleIdx + 3);
  
  const totalAnswered = Object.keys(answers).length;
  const isAllAnswered = totalAnswered === questions.length;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-2 md:p-6 select-none">
      <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="p-5 bg-slate-900 text-white flex justify-between items-center border-b-4 border-orange-600">
          <div>
            <h1 className="text-sm font-black uppercase italic tracking-tighter">{res?.data?.testName}</h1>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-500" 
                    style={{ width: `${(totalAnswered / questions.length) * 100}%` }}
                  />
               </div>
               <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">
                {totalAnswered} / {questions.length} Solved
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 font-mono font-black text-xl transition-colors shadow-lg ${timeLeft && timeLeft < 60 ? 'bg-red-600 animate-pulse' : 'bg-orange-600'}`}>
            <FaClock size={16}/>
            <span>{timeLeft !== null ? formatTime(timeLeft) : '--:--'}</span>
          </div>
        </div>

        <div className="p-4 md:p-8 space-y-8 max-h-[65vh] overflow-y-auto scroll-smooth">
          {visibleQuestions.map((q: any, idx: number) => {
            const globalIdx = visibleIdx + idx;
            return (
              <div key={q._id} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-5 transition-all hover:shadow-md">
                <h2 className="text-md font-black text-slate-800 leading-relaxed flex items-start gap-3">
                  <span className="bg-slate-900 text-white text-[10px] min-w-[28px] h-7 flex items-center justify-center rounded-lg mt-0.5 shadow-sm">
                    {globalIdx + 1}
                  </span>
                  {q.questionText}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((option: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setAnswers({ ...answers, [q._id]: option })}
                      className={`p-4 rounded-2xl text-left font-bold transition-all border-2 flex items-center gap-3 text-xs group
                        ${answers[q._id] === option 
                          ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-inner' 
                          : 'border-white bg-white text-slate-500 hover:border-orange-200 hover:bg-slate-50 shadow-sm'}`}
                    >
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black transition-colors
                        ${answers[q._id] === option ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100'}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="p-5 bg-white border-t border-slate-100 flex justify-between items-center gap-4">
          <button 
            disabled={visibleIdx === 0}
            onClick={() => setVisibleIdx(v => Math.max(0, v - 3))}
            className="px-6 py-3 rounded-xl font-black text-[10px] uppercase bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:opacity-30 transition-all active:scale-95"
          >
            Previous
          </button>

          <div className="flex gap-3">
            {visibleIdx + 3 < questions.length ? (
              <button 
                onClick={() => setVisibleIdx(v => v + 3)}
                className="px-8 py-3 rounded-xl font-black text-[10px] uppercase bg-slate-900 text-white hover:bg-orange-600 transition-all shadow-lg active:scale-95"
              >
                Next Questions
              </button>
            ) : (
              <button 
                onClick={() => finalSubmit()}
                disabled={isSubmitting || !isAllAnswered}
                className={`px-8 h-12 rounded-xl font-black text-[10px] uppercase text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 
                  ${isAllAnswered ? 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700' : 'bg-slate-300 cursor-not-allowed shadow-none'}`}
              >
                {isSubmitting ? (
                  <div className="scale-[0.4]"><Spinner /></div>
                ) : (
                  <>
                    <FaCheckCircle size={14}/>
                    {isAllAnswered ? "Finalize Test" : `${questions.length - totalAnswered} Pending`}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <p className="mt-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        System Monitoring Active • Secure <span className="text-orange-600">Exam</span> Mode
      </p>
    </div>
  );
};

export default Test;