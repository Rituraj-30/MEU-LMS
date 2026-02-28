import { useCreateAssignmentMutation } from '../../../../services/teacherApi';
import ContentForm from './ContentForm';

const CreateAssignment = () => {
    return <ContentForm type="assignment" mutationHook={useCreateAssignmentMutation} />;
};
export default CreateAssignment;




// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaPlus, FaTimes, FaRobot, FaCalendarAlt, FaStar, FaSpinner } from 'react-icons/fa';
// import { useCreateAssignmentMutation } from '../../../../services/teacherApi'; // Adjust import
// import toast from 'react-hot-toast';

// const CreateAssignment: React.FC = () => {
//     const navigate = useNavigate();
//     const [createAssignment, { isLoading }] = useCreateAssignmentMutation();

//     // Local States
//     const [formData, setFormData] = useState({
//         title: '',
//         deadline: '',
//         totalMarks: 10,
//         subjectCode: '',
//     });
//     const [topicInput, setTopicInput] = useState('');
//     const [topics, setTopics] = useState<string[]>([]);

//     const addTopic = () => {
//         if (!topicInput.trim()) return;
//         if (topics.includes(topicInput.trim())) return toast.error("Topic already added");
//         setTopics([...topics, topicInput.trim()]);
//         setTopicInput('');
//     };

//     const removeTopic = (index: number) => {
//         setTopics(topics.filter((_, i) => i !== index));
//     };

//     const handleFinalSubmit = async () => {
//         if (!formData.title || topics.length === 0 || !formData.deadline || !formData.subjectCode) {
//             return toast.error("Fill all fields and add at least one topic!");
//         }

//         const payload = {
//             ...formData,
//             topics: topics
//         };

//         const toastId = toast.loading("AI is generating questions...");
//         try {
//             await createAssignment(payload).unwrap();
//             toast.success("Assignment & Questions generated!", { id: toastId });
//             setTimeout(() => navigate(-1), 1500);
//         } catch (err: any) {
//             toast.error(err.data?.message || "Failed to generate assignment", { id: toastId });
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
//                             Create <span className="text-orange-600">AI Assignment</span>
//                         </h1>
//                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic text-orange-500">
//                             Powered by Gemini 1.5 Flash
//                         </p>
//                     </div>
//                     <button 
//                         disabled={isLoading}
//                         onClick={handleFinalSubmit}
//                         className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
//                     >
//                         {isLoading ? <FaSpinner className="animate-spin"/> : <FaRobot size={12}/>}
//                         {isLoading ? 'Generating...' : 'Create with AI'}
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Left Panel: Basic Details */}
//                     <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm space-y-4">
//                         <div className="space-y-1">
//                             <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Assignment Title</label>
//                             <input 
//                                 type="text" 
//                                 placeholder="E.G. PYTHON BASICS"
//                                 className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-xs font-bold uppercase outline-none focus:border-orange-500 transition-all"
//                                 value={formData.title}
//                                 onChange={(e) => setFormData({...formData, title: e.target.value.toUpperCase()})}
//                             />
//                         </div>

//                         <div className="space-y-1">
//                             <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Subject Code</label>
//                             <input 
//                                 type="text" 
//                                 placeholder="CS101"
//                                 className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-xs font-bold uppercase outline-none focus:border-orange-500"
//                                 value={formData.subjectCode}
//                                 onChange={(e) => setFormData({...formData, subjectCode: e.target.value.toUpperCase()})}
//                             />
//                         </div>

//                         <div className="flex gap-4">
//                             <div className="flex-1 space-y-1">
//                                 <label className="text-[9px] font-black uppercase text-slate-400 ml-2 flex items-center gap-1"><FaCalendarAlt/> Deadline</label>
//                                 <input 
//                                     type="date" 
//                                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-xs font-bold outline-none"
//                                     value={formData.deadline}
//                                     onChange={(e) => setFormData({...formData, deadline: e.target.value})}
//                                 />
//                             </div>
//                             <div className="w-24 space-y-1">
//                                 <label className="text-[9px] font-black uppercase text-slate-400 ml-2 flex items-center gap-1"><FaStar/> Marks</label>
//                                 <input 
//                                     type="number" 
//                                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-xs font-bold outline-none"
//                                     value={formData.totalMarks}
//                                     onChange={(e) => setFormData({...formData, totalMarks: Number(e.target.value)})}
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Panel: Topics Management */}
//                     <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-col">
//                         <label className="text-[9px] font-black uppercase text-slate-400 mb-2 ml-2">Add Topics for AI Analysis</label>
//                         <div className="flex gap-2 mb-4">
//                             <input 
//                                 type="text" 
//                                 placeholder="TYPE TOPIC..."
//                                 className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-xs font-bold uppercase outline-none focus:border-emerald-500"
//                                 value={topicInput}
//                                 onChange={(e) => setTopicInput(e.target.value)}
//                                 onKeyPress={(e) => e.key === 'Enter' && addTopic()}
//                             />
//                             <button onClick={addTopic} className="bg-emerald-500 text-white p-4 rounded-2xl hover:bg-emerald-600 transition-all">
//                                 <FaPlus size={14}/>
//                             </button>
//                         </div>

//                         {/* Topics List */}
//                         <div className="flex-1 overflow-y-auto max-h-[200px] pr-2 space-y-2">
//                             {topics.length === 0 ? (
//                                 <div className="text-center py-10">
//                                     <p className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">No topics added yet</p>
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

//                 {/* Footer Info */}
//                 <div className="mt-8 p-6 bg-slate-900 rounded-[2.5rem] text-center shadow-xl">
//                     <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">How it works</p>
//                     <p className="text-[11px] font-bold text-slate-300 leading-relaxed max-w-lg mx-auto italic uppercase tracking-tighter">
//                         AI will analyze your topics to generate <span className="text-orange-500 font-black">5 unique questions</span> and <span className="text-orange-500 font-black">standard reference answers</span> for automated student grading.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CreateAssignment;