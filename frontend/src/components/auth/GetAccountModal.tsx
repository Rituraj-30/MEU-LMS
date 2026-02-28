import React from 'react';
import { X, Copy, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface GetAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetAccountModal: React.FC<GetAccountModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const demoAccounts = [
    { role: 'HOD', email: 'hod@mu.edu.in', pass: 'hod123' },
    { role: 'Staff', email: 'TestFaculty@gmail.com', pass: 'TestFaculty' },
    { role: 'Student', email: 'TestStudent@gmail.com', pass: 'TestStudent' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      style: { background: '#333', color: '#fff', fontSize: '12px' }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Body */}
      <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="text-orange-500" size={20} />
                Demo Credentials
              </h3>
              <p className="text-gray-500 text-xs mt-1">Use these to explore the portal features</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {demoAccounts.map((acc, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-orange-500/30 transition-all">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                    {acc.role}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-gray-400">Email:</span>
                    <button 
                      onClick={() => copyToClipboard(acc.email)}
                      className="text-white hover:text-orange-500 flex items-center gap-1.5 transition-colors font-medium"
                    >
                      {acc.email} <Copy size={12} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-gray-400">Password:</span>
                    <button 
                      onClick={() => copyToClipboard(acc.pass)}
                      className="text-white hover:text-orange-500 flex items-center gap-1.5 transition-colors font-medium"
                    >
                      {acc.pass} <Copy size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 py-3 bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-orange-700 transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetAccountModal;