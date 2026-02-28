import React, { useState } from 'react';
import { useUpdatePasswordMutation } from '../../services/authApi';
import { toast } from 'react-hot-toast';
import { FaLock, FaSpinner, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';

const InputField = ({ label, name, value, showKey, showPass, setShowPass, onChange }: any) => (
  <div className="mb-3 relative text-left">
    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{label}</label>
    <div className="relative mt-1">
      <input 
        type={showPass[showKey] ? "text" : "password"}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all pr-10 bg-gray-50/50"
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required
      />
      <button 
        type="button"
        onClick={() => setShowPass({ ...showPass, [showKey]: !showPass[showKey] })}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600"
      >
        {showPass[showKey] ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
      </button>
    </div>
  </div>
);

const UpdatePasswordModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });

  if (!isOpen) return null;

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    try {
      await updatePassword(formData).unwrap();
      toast.success("Password Updated Successfully!");
      onClose();
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err?.data?.message || "Update Failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg"><FaLock size={12} /></div>
            <span className="text-xs font-bold uppercase tracking-widest">Update Security</span>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><FaTimes /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5">
          <InputField 
            label="Current Password" 
            name="oldPassword" 
            value={formData.oldPassword} 
            showKey="old" 
            showPass={showPass} 
            setShowPass={setShowPass} 
            onChange={handleChange} 
          />
          <div className="h-[1px] bg-gray-100 my-4" />
          <InputField 
            label="New Password" 
            name="newPassword" 
            value={formData.newPassword} 
            showKey="new" 
            showPass={showPass} 
            setShowPass={setShowPass} 
            onChange={handleChange} 
          />
          <InputField 
            label="Confirm New Password" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            showKey="confirm" 
            showPass={showPass} 
            setShowPass={setShowPass} 
            onChange={handleChange} 
          />

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : "Secure Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;