import React, { useState } from 'react';
import { FaTimes, FaBook, FaCalendarDay, FaChalkboardTeacher, FaCheck } from 'react-icons/fa'; // FaSpinner yahan se hata diya
import { useCreateScheduleMutation } from '../../../../services/hodapi';
import { toast } from 'react-hot-toast';
import Spinner from '../../../comman/Spinner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  semesterGroupId: string;
}

const ScheduleFormModal: React.FC<Props> = ({ isOpen, onClose, semesterGroupId }) => {
  const [createSchedule, { isLoading: isSubmitting }] = useCreateScheduleMutation();

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [formData, setFormData] = useState({
    subjectCode: '',
    days: [] as string[],
    type: 'Theory',
    startTime: '',
    endTime: '',
    roomNumber: ''
  });

  if (!isOpen) return null;

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day) 
        : [...prev.days, day]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.days.length === 0) {
      return toast.error("Please select at least one day!");
    }

    const toastId = toast.loading("Creating schedules...");
    
    try {
      await createSchedule({ ...formData, semesterGroupId }).unwrap();
      toast.success("Schedules Created Successfully!", { id: toastId });
      
      setFormData({ 
        subjectCode: '', 
        days: [], 
        type: 'Theory',
        startTime: '', 
        endTime: '', 
        roomNumber: '' 
      });
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Conflict or Error Occurred!", { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl border border-white/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 px-7 py-5 text-white flex justify-between items-center">
          <h1 className="text-xs font-black uppercase tracking-[0.2em]">
            Set <span className="text-orange-500">Academic Schedule</span>
          </h1>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-600 transition-all">
            <FaTimes size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          
          {/* Row 1: Subject & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                <FaBook className="text-orange-500" /> Subject Code
              </label>
              <input 
                required type="text" placeholder="e.g. CS-101"
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all"
                value={formData.subjectCode}
                onChange={(e) => setFormData({...formData, subjectCode: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                <FaChalkboardTeacher className="text-orange-500" /> Lecture Type
              </label>
              <select 
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-orange-500 cursor-pointer"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>
            </div>
          </div>

          {/* Row 2: Day Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
              <FaCalendarDay className="text-orange-500"/> Select Days (Multiple)
            </label>
            <div className="flex flex-wrap gap-2">
              {allDays.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all border-2 ${
                    formData.days.includes(day) 
                    ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-orange-200'
                  }`}
                >
                  {formData.days.includes(day) && <FaCheck className="inline mr-1 mb-0.5" />}
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Room & Time */}
          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room</label>
                <input 
                  required type="text" placeholder="302"
                  className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-orange-500"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start</label>
                <input 
                  required type="time" 
                  className="w-full p-3 bg-white border-2 border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:border-orange-500" 
                  value={formData.startTime} 
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})} 
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End</label>
                <input 
                  required type="time" 
                  className="w-full p-3 bg-white border-2 border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:border-orange-500" 
                  value={formData.endTime} 
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})} 
                />
             </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-14 bg-slate-900 text-white mt-2 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="scale-[0.4]">
                 <Spinner />
              </div>
            ) : (
              "Confirm Weekly Schedule"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleFormModal;