

import { useCreateTestMutation } from '../../../../services/teacherApi';
import ContentForm from './ContentForm';

const CreateTest = () => {
    return <ContentForm type="test" mutationHook={useCreateTestMutation} />;
};
export default CreateTest;










// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaPlus, FaTimes, FaRobot, FaCalendarAlt, FaClock, FaSpinner } from 'react-icons/fa';
// import { useCreateTestMutation } from '../../../../services/teacherApi'; // Aapki API service ka path
// import toast from 'react-hot-toast';

// const CreateTest: React.FC = () => {
//     const navigate = useNavigate();
//     const [createTest, { isLoading }] = useCreateTestMutation();

//     // Local States
//     const [formData, setFormData] = useState({
//         testName: '',
//         testDate: '', // Start Time
//         duration: 30, // Default 30 minutes
//         subjectCode: '',
//     });
//     const [topicInput, setTopicInput] = useState('');
//     const [topics, setTopics] = useState<string[]>([]);

//     const addTopic = () => {
//         if (!topicInput.trim()) return;
//         if (topics.includes(topicInput.trim())) return toast.error("Topic already added");
//         if (topics.length >= 6) return toast.error("Maximum 6 topics allowed for better AI results");
//         setTopics([...topics, topicInput.trim()]);
//         setTopicInput('');
//     };

//     const removeTopic = (index: number) => {
//         setTopics(topics.filter((_, i) => i !== index));
//     };

//     const handleFinalSubmit = async () => {
//         if (!formData.testName || topics.length === 0 || !formData.testDate || !formData.subjectCode) {
//             return toast.error("All fields are required!");
//         }

//         const payload = {
//             ...formData,
//             topics: topics
//         };

//         const toastId = toast.loading("Gemini is generating 30 tricky MCQs...");
//         try {
//             await createTest(payload).unwrap();
//             toast.success("Test Scheduled & 30 MCQs Generated!", { id: toastId });
//             setTimeout(() => navigate(-1), 1500);
//         } catch (err: any) {
//             toast.error(err.data?.message || "Failed to generate test", { id: toastId });
//         }
//     };

//     return (
//         <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
//             <div className="max-w-3xl mx-auto">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
//                     <button onClick={() => navigate(-1)} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
//                         <FaArrowLeft />
//                     </button>
//                     <div className="text-center">
//                         <h1 className="text-lg font-black uppercase italic tracking-tighter text-slate-900">
//                             Schedule <span className="text-orange-600">AI MCQ Test</span>
//                         </h1>
//                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic text-orange-500">
//                             30 Questions • 30 Marks • AI Powered
//                         </p>
//                     </div>
//                     <button 
//                         disabled={isLoading}
//                         onClick={handleFinalSubmit}
//                         className="bg-orange-600 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
//                     >
//                         {isLoading ? <FaSpinner className="animate-spin"/> : <FaRobot size={12}/>}
//                         {isLoading ? 'Generating 30 MCQs...' : 'Generate Test'}
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Left Panel: Test Details */}
//                     <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm space-y-4">
//                         <div className="space-y-1">
//                             <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Test Name / Title</label>
//                             <input 
//                                 type="text" 
//                                 placeholder="E.G. UNIT TEST - 1"
//                                 className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-xs font-bold uppercase outline-none focus:border-orange-500 transition-all"
//                                 value={formData.testName}
//                                 onChange={(e) => setFormData({...formData, testName: e.target.value.toUpperCase()})}
//                             />
//                         </div>

//                         <div className="space-y-1">
//                             <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Subject Code</label>
//                             <input 
//                                 type="text" 
//                                 placeholder="E.G. DSA101"
//                                 className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-xs font-bold uppercase outline-none focus:border-orange-500"
//                                 value={formData.subjectCode}
//                                 onChange={(e) => setFormData({...formData, subjectCode: e.target.value.toUpperCase()})}
//                             />
//                         </div>

//                         <div className="flex gap-4">
//                             <div className="flex-1 space-y-1">
//                                 <label className="text-[9px] font-black uppercase text-slate-400 ml-2 flex items-center gap-1"><FaCalendarAlt/> Start Time</label>
//                                 <input 
//                                     type="datetime-local" // DateTime use kiya hai test ke liye
//                                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-[10px] font-bold outline-none focus:border-orange-500"
//                                     value={formData.testDate}
//                                     onChange={(e) => setFormData({...formData, testDate: e.target.value})}
//                                 />
//                             </div>
//                             <div className="w-24 space-y-1">
//                                 <label className="text-[9px] font-black uppercase text-slate-400 ml-2 flex items-center gap-1"><FaClock/> Min</label>
//                                 <input 
//                                     type="number" 
//                                     placeholder="30"
//                                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-xs font-bold outline-none focus:border-orange-500"
//                                     value={formData.duration}
//                                     onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Panel: Topics Management */}
//                     <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-col">
//                         <label className="text-[9px] font-black uppercase text-slate-400 mb-2 ml-2">Topics for MCQs (Min 1, Max 6)</label>
//                         <div className="flex gap-2 mb-4">
//                             <input 
//                                 type="text" 
//                                 placeholder="E.G. ARRAY INSERTION"
//                                 className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-xs font-bold uppercase outline-none focus:border-orange-500"
//                                 value={topicInput}
//                                 onChange={(e) => setTopicInput(e.target.value.toUpperCase())}
//                                 onKeyPress={(e) => e.key === 'Enter' && addTopic()}
//                             />
//                             <button onClick={addTopic} className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-orange-600 transition-all">
//                                 <FaPlus size={14}/>
//                             </button>
//                         </div>

//                         {/* Topics List */}
//                         <div className="flex-1 overflow-y-auto max-h-[180px] pr-2 space-y-2">
//                             {topics.length === 0 ? (
//                                 <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl">
//                                     <p className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">Add topics to generate MCQs</p>
//                                 </div>
//                             ) : (
//                                 topics.map((t, i) => (
//                                     <div key={i} className="flex items-center justify-between bg-slate-50 border-2 border-slate-100 p-3 rounded-2xl group animate-in slide-in-from-right-5">
//                                         <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{t}</span>
//                                         <button onClick={() => removeTopic(i)} className="text-slate-300 hover:text-red-500 transition-colors">
//                                             <FaTimes size={12}/>
//                                         </button>
//                                     </div>
//                                 ))
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer Info Box */}
//                 <div className="mt-8 p-6 bg-slate-900 rounded-[2.5rem] text-center shadow-xl border-b-4 border-orange-600">
//                     <div className="flex justify-center gap-8 mb-4">
//                         <div className="text-center">
//                             <p className="text-orange-500 text-lg font-black italic">30</p>
//                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Questions</p>
//                         </div>
//                         <div className="text-center">
//                             <p className="text-orange-500 text-lg font-black italic">5m</p>
//                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Join Window</p>
//                         </div>
//                         <div className="text-center">
//                             <p className="text-orange-500 text-lg font-black italic">30</p>
//                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Marks</p>
//                         </div>
//                     </div>
//                     <p className="text-[10px] font-bold text-slate-400 leading-relaxed max-w-lg mx-auto italic uppercase tracking-tighter">
//                         AI will generate <span className="text-white">Tricky Multiple Choice Questions</span>. Students will have a <span className="text-white">5-minute grace period</span> to join after the start time.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CreateTest;