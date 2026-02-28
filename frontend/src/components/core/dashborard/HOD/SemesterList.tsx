import { useState } from 'react';
import { FaPlus, FaSearch, FaClock } from 'react-icons/fa'; // FaSpinner hata diya
import { useGetAllSemesterGroupsQuery } from '../../../../services/hodapi';
import SemesterManagement from './SemesterManagement'; 
import ScheduleFormModal from './ScheduleFormModal'; 

import Spinner from '../../../comman/Spinner';

const SemesterList = () => {
  const { data: groupsData, isLoading: groupsLoading } = useGetAllSemesterGroupsQuery(undefined);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const handleOpenSchedule = (groupId: string) => {
    setSelectedGroupId(groupId); 
    setIsScheduleModalOpen(true);
  };

  const filteredGroups = groupsData?.data?.filter((group: any) =>
    group.courseId?.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Naya Spinner Implementation ---
  if (groupsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <Spinner />
      </div>
    );
  }
  // -----------------------------------

  return (
    <div className="p-4 md:p-6 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Semester <span className="text-orange-600">Management</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium italic">Manage groups and lectures</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-slate-200"
          >
            <FaPlus /> Manage Semester
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" placeholder="Search by course..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm font-semibold shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4 text-center">Batch</th>
                <th className="px-6 py-4 text-center">Semester</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGroups?.map((group: any) => (
                <tr key={group._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-4 text-sm font-black text-slate-800 uppercase group-hover:text-orange-600">{group.courseId?.courseName}</td>
                  <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">{group.year}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-xl text-[11px] font-black border border-orange-100">SEM {group.semester}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleOpenSchedule(group._id)}
                      className="text-[10px] font-black text-white bg-slate-900 px-4 py-2.5 rounded-xl hover:bg-orange-600 transition-all uppercase flex items-center gap-2 ml-auto shadow-md"
                    >
                       <FaClock size={12}/> Add Lecture
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Edge Case: Empty Search Results */}
          {!groupsLoading && filteredGroups?.length === 0 && (
            <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
              No matching courses found
            </div>
          )}
        </div>
      </div>

      {/* Popups */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <SemesterManagement onBack={() => setIsCreateModalOpen(false)} />
        </div>
      )}

      <ScheduleFormModal 
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        semesterGroupId={selectedGroupId}
      />
    </div>
  );
};

export default SemesterList;