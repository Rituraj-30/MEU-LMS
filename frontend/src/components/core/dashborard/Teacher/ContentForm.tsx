import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTimes, FaRobot, FaCalendarAlt, FaStar, FaSpinner, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';


interface AiFormProps {
    type: 'assignment' | 'test';
    mutationHook: any;
}

const ContentForm: React.FC<AiFormProps> = ({ type, mutationHook }) => {
    const navigate = useNavigate();
    const [triggerMutation, { isLoading }] = mutationHook();

    const isTest = type === 'test';

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        date: '', // Deadline for assignment, Start Time for test
        value: isTest ? 30 : 10, // Duration for test, Marks for assignment
        subjectCode: '',
    });
    const [topicInput, setTopicInput] = useState('');
    const [topics, setTopics] = useState<string[]>([]);

    const addTopic = () => {
        if (!topicInput.trim()) return;
        if (topics.includes(topicInput.trim())) return toast.error("Topic already added");
        if (isTest && topics.length >= 6) return toast.error("Max 6 topics for tests");
        setTopics([...topics, topicInput.trim().toUpperCase()]);
        setTopicInput('');
    };

    const handleFinalSubmit = async () => {
        if (!formData.title || topics.length === 0 || !formData.date || !formData.subjectCode) {
            return toast.error("Please fill all fields!");
        }

        const payload = isTest ? {
            testName: formData.title,
            testDate: formData.date,
            duration: formData.value,
            subjectCode: formData.subjectCode,
            topics
        } : {
            title: formData.title,
            deadline: formData.date,
            totalMarks: formData.value,
            subjectCode: formData.subjectCode,
            topics
        };

        const toastId = toast.loading(isTest ? "Generating 30 Tricky MCQs..." : "AI is generating questions...");
        try {
            await triggerMutation(payload).unwrap();
            toast.success(`${isTest ? 'Test' : 'Assignment'} Created Successfully!`, { id: toastId });
            setTimeout(() => navigate(-1), 1500);
        } catch (err: any) {
            toast.error(err.data?.message || "Generation failed", { id: toastId });
        }
    };

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                    <button onClick={() => navigate(-1)} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-orange-600 transition-colors">
                        <FaArrowLeft />
                    </button>
                    <div className="text-center">
                        <h1 className="text-lg font-black uppercase italic tracking-tighter text-slate-900">
                            Create <span className="text-orange-600">AI {type}</span>
                        </h1>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">
                            Powered by Gemini 1.5 Flash
                        </p>
                    </div>
                    <button 
                        disabled={isLoading}
                        onClick={handleFinalSubmit}
                        className="bg-orange-600 shadow-orange-500/20 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? <FaSpinner className="animate-spin"/> : <FaRobot size={12}/>}
                        {isLoading ? 'Processing...' : `Create ${type}`}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Panel */}
                    <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-slate-400 ml-2">{type} Title</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-xs font-bold uppercase outline-none focus:border-orange-500 transition-all"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value.toUpperCase()})}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Subject Code</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-xs font-bold uppercase outline-none focus:border-orange-500 transition-all"
                                value={formData.subjectCode}
                                onChange={(e) => setFormData({...formData, subjectCode: e.target.value.toUpperCase()})}
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1">
                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2 flex items-center gap-1">
                                    <FaCalendarAlt className="text-orange-500"/> {isTest ? 'Start Time' : 'Deadline'}
                                </label>
                                <input 
                                    type={isTest ? "datetime-local" : "date"}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-[10px] font-bold outline-none focus:border-orange-500 transition-all"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                            <div className="w-24 space-y-1">
                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2 flex items-center gap-1">
                                    {isTest ? <><FaClock className="text-orange-500"/> Min</> : <><FaStar className="text-orange-500"/> Marks</>}
                                </label>
                                <input 
                                    type="number" 
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-xs font-bold outline-none focus:border-orange-500 transition-all"
                                    value={formData.value}
                                    onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Topics */}
                    <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm flex flex-col">
                        <label className="text-[9px] font-black uppercase text-slate-400 mb-2 ml-2">Topics for AI Analysis</label>
                        <div className="flex gap-2 mb-4">
                            <input 
                                type="text" 
                                placeholder="TYPE TOPIC..."
                                className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-xs font-bold uppercase outline-none focus:border-orange-500 transition-all"
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                            />
                            <button onClick={addTopic} className="bg-orange-600 hover:bg-slate-900 text-white p-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-90">
                                <FaPlus size={14}/>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[200px] space-y-2 no-scrollbar">
                            {topics.map((t, i) => (
                                <div key={i} className="flex items-center justify-between bg-white border-2 border-slate-100 p-3 rounded-2xl animate-in slide-in-from-right-5 hover:border-orange-200 transition-colors">
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{t}</span>
                                    <button onClick={() => setTopics(topics.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500 transition-colors">
                                        <FaTimes size={12}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentForm;