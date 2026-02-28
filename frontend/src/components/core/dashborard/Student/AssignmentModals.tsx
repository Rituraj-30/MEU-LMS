import React, { useState, useRef } from 'react';
import { X, Copy, Check, UploadCloud, CheckCircle2, FileText, Trash2, Clock } from 'lucide-react';
import { useSubmitAssignmentMutation } from '../../../../services/studentApi';
import toast from 'react-hot-toast';
import Spinner from '../../../comman/Spinner';

interface ModalProps {
  type: 'view' | 'submit';
  data: any;
  onClose: () => void;
}

const AssignmentModals: React.FC<ModalProps> = ({ type, data, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RTK Query Mutation Hook
  const [submitAssignment, { isLoading }] = useSubmitAssignmentMutation();

  // Deadline Logic: Check if current time is past the deadline
  const deadlineDate = new Date(data.deadline);
  const isLate = new Date() > deadlineDate;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLate) return toast.error("Bhai, deadline nikal chuki hai!");

    const file = e.target.files?.[0];
    if (file) {
      // Strictly PDF Check
      if (file.type !== 'application/pdf') {
        if (fileInputRef.current) fileInputRef.current.value = "";
        return toast.error("Strictly PDF Only! Other formats not allowed.");
      }
      // Size Check (10MB)
      if (file.size > 10 * 1024 * 1024) {
        return toast.error("File 10MB se badi nahi honi chahiye");
      }
      setSelectedFile(file);
      toast.success("PDF attached successfully");
    }
  };

  const handleFinalSubmit = async () => {
    if (isLate) return toast.error("Late submission not allowed!");
    if (!selectedFile) return toast.error("Pehle PDF file select karo!");

    const toastId = toast.loading("Uploading your submission...");
    try {
      await submitAssignment({ 
        assignmentId: data._id, 
        file: selectedFile 
      }).unwrap();

      toast.success("Assignment submitted Successfully!", { id: toastId });
      onClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Submit failed! Try again.", { id: toastId });
    }
  };

  // --- VIEW QUESTIONS MODE ---
  if (type === 'view') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl flex flex-col max-h-[75vh] border border-slate-100">
          <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white rounded-t-[2rem]">
            <div>
              <h2 className="text-md font-black text-slate-900 uppercase italic tracking-tighter">Assignment <span className="text-orange-600">Questions</span></h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{data.subjectCode}</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-50 text-slate-400 rounded-full transition-all"><X size={18} /></button>
          </div>
          <div className="p-4 overflow-y-auto space-y-2 bg-[#fcfcfd]">
            {data.questions?.map((q: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-100 group shadow-sm hover:border-orange-200 transition-all">
                <span className="bg-slate-900 text-white text-[9px] font-black min-w-[24px] h-6 flex items-center justify-center rounded-lg">{idx + 1}</span>
                <p className="flex-1 text-[13px] font-bold text-slate-700 leading-relaxed">{q}</p>
                <button onClick={() => handleCopy(q, idx)} className="text-slate-300 hover:text-orange-500 shrink-0">
                  {copiedIndex === idx ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- SUBMIT PDF MODE (COMPACT) ---
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in zoom-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden">
        <div className="p-6 text-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner ${isLate ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-600'}`}>
            {isLate ? <Clock size={28} /> : <UploadCloud size={28} />}
          </div>
          
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
            {isLate ? <span className="text-red-600 uppercase">Deadline Missed</span> : <>Push <span className="text-orange-600">PDF</span></>}
          </h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6 truncate px-4">{data.title}</p>
          
          {data.isSubmitted ? (
              <div className="bg-emerald-50 p-6 rounded-[2rem] border-2 border-emerald-100/50 mb-2 animate-in slide-in-from-bottom-2">
                <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={24} />
                <p className="text-emerald-900 font-black uppercase text-[10px]">Submitted Successfully</p>
                <p className="text-emerald-600/60 font-bold uppercase text-[8px] mt-0.5 tracking-tighter">Reviewing in progress</p>
              </div>
          ) : (
            <div className="space-y-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="application/pdf"
              />
              
              {!selectedFile ? (
                <div 
                  onClick={() => !isLate && fileInputRef.current?.click()}
                  className={`group py-8 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer relative overflow-hidden ${isLate ? 'border-red-100 bg-red-50/20 cursor-not-allowed' : 'border-slate-100 hover:border-orange-400 hover:bg-orange-50/20'}`}
                >
                   <FileText className={`mx-auto mb-2 ${isLate ? 'text-red-200' : 'text-slate-200 group-hover:text-orange-500'}`} size={28} />
                   <p className={`${isLate ? 'text-red-300' : 'text-slate-400'} font-black uppercase text-[9px]`}>
                     {isLate ? "Upload Locked" : "Select PDF Only"}
                   </p>
                   {isLate && <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />}
                </div>
              ) : (
                <div className="bg-slate-900 p-4 rounded-2xl flex items-center justify-between text-left shadow-lg animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-orange-500 shadow-inner">
                        <FileText size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-white font-black text-[10px] truncate uppercase italic pr-2">{selectedFile.name}</p>
                      <p className="text-slate-500 font-black text-[8px] uppercase tracking-widest">PDF Ready</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedFile(null)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                </div>
              )}

              <button 
                  onClick={handleFinalSubmit}
                  className={`w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${isLate ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-slate-900 text-white hover:bg-orange-600 disabled:bg-slate-100 disabled:text-slate-300'}`}
                  disabled={(!selectedFile && !isLate) || isLoading}
              >
                  {isLoading ? (
                    <div className="scale-[0.4]">
                        <Spinner />
                    </div>
                  ) : (
                    isLate ? "Submit Blocked" : "Finalize Submission"
                  )}
              </button>
            </div>
          )}
          
          {!isLoading && (
            <button 
              onClick={onClose} 
              className="mt-5 text-slate-300 hover:text-slate-900 font-black uppercase text-[9px] tracking-widest transition-colors"
            >
                Close Modal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentModals;