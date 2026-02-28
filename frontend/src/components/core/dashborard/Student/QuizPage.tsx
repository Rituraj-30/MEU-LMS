import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetStudentTestsQuery } from '../../../../services/studentApi'; // Isse questions fetch honge

import Spinner from '../../../comman/Spinner';

const QuizPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { data } = useGetStudentTestsQuery();
  
  const currentTest = data?.data?.find((t: any) => t._id === testId);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer Setup
  useEffect(() => {
    if (currentTest) {
      const startTime = new Date(currentTest.testDate).getTime();
      const endTime = startTime + currentTest.duration * 60000;
      const remaining = Math.floor((endTime - Date.now()) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);
    }
  }, [currentTest]);

  useEffect(() => {
    if (timeLeft <= 0 && currentTest) handleAutoSubmit();
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAutoSubmit = () => {
    console.log("Time up! Submitting...");
    submitTest();
  };

  const submitTest = async () => {
    alert("Test Submitted Successfully!");
    navigate('/student/tests');
  };

  if (!currentTest) return <Spinner />;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header with Timer */}
      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-2xl mb-6 border border-slate-700">
        <div>
          <h2 className="text-xl font-bold uppercase">{currentTest.testName}</h2>
          <p className="text-xs text-slate-400">Question {currentIdx + 1} of {currentTest.questions.length}</p>
        </div>
        <div className={`px-6 py-2 rounded-xl font-black text-2xl ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Question Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700 min-h-[300px]">
            <h1 className="text-2xl font-bold mb-8 italic">
              Q{currentIdx + 1}. {currentTest.questions[currentIdx].questionText}
            </h1>
            <div className="grid grid-cols-1 gap-4">
              {currentTest.questions[currentIdx].options.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setAnswers({...answers, [currentIdx]: opt})}
                  className={`p-4 text-left rounded-xl border-2 transition-all ${
                    answers[currentIdx] === opt 
                    ? 'border-orange-500 bg-orange-500/10' 
                    : 'border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span className="mr-4 text-slate-500 font-bold">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button 
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="px-8 py-3 bg-slate-700 rounded-xl disabled:opacity-50"
            >Previous</button>
            
            {currentIdx === currentTest.questions.length - 1 ? (
              <button onClick={submitTest} className="px-8 py-3 bg-orange-600 rounded-xl font-bold">Finish Test</button>
            ) : (
              <button onClick={() => setCurrentIdx(prev => prev + 1)} className="px-8 py-3 bg-blue-600 rounded-xl">Next Question</button>
            )}
          </div>
        </div>

        {/* Question Palette */}
        <div className="bg-slate-800 p-6 rounded-[2rem] border border-slate-700 h-fit">
          <h3 className="text-sm font-black uppercase mb-4 text-slate-400">Question Palette</h3>
          <div className="grid grid-cols-5 gap-3">
            {currentTest.questions.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`w-10 h-10 rounded-lg font-bold text-xs ${
                  currentIdx === i ? 'ring-2 ring-orange-500' : ''
                } ${answers[i] ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;