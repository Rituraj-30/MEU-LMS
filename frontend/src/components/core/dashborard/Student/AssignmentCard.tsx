import React from 'react';
import { Clock, Award, Eye, Send, CheckCircle2, Star } from 'lucide-react'; // Star icon add kiya marks ke liye

interface CardProps {
  item: any;
  onView: (item: any) => void;
  onSubmit: (item: any) => void;
}

const AssignmentCard: React.FC<CardProps> = ({ item, onView, onSubmit }) => {
  const isSubmitted = item.isSubmitted === true;
  // Backend se marks nikal rahe hain
  const marks = item.submissionDetails?.marksObtained;

  return (
    <div className="group bg-white border border-slate-200 rounded-[2.5rem] p-6 hover:shadow-2xl hover:shadow-orange-500/10 transition-all">
      <div className="flex justify-between items-start mb-6">
        <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
          {item.subjectCode}
        </span>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${isSubmitted ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
            {isSubmitted ? 'Completed' : 'Pending'}
          </span>
          
          {/* --- Marks Display Section --- */}
          {isSubmitted && marks !== undefined && (
            <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 px-2 py-1 rounded-lg">
              <Star size={10} className="text-orange-600 fill-orange-600" />
              <span className="text-[10px] font-black text-orange-700">
                SCORE: {marks}/{item.totalMarks}
              </span>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-lg font-black text-slate-800 uppercase leading-tight mb-4">
        Topic: {item.title}
      </h3>

      <div className="flex gap-4 mb-8">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock size={12} className="text-orange-500" />
          <span className="text-[10px] font-bold">
            {new Date(item.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Award size={12} className="text-orange-500" />
          <span className="text-[10px] font-bold">{item.totalMarks} Total Marks</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
        <button 
          onClick={() => onView(item)}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
        >
          <Eye size={14} /> Questions
        </button>
        
        <button 
          onClick={() => !isSubmitted && onSubmit(item)}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
            isSubmitted 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default' 
            : 'bg-orange-600 text-white hover:bg-slate-900 shadow-lg shadow-orange-500/20'
          }`}
        >
          {isSubmitted ? <CheckCircle2 size={14} /> : <Send size={14} />}
          {isSubmitted ? 'Submitted' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;