import React, { useState } from 'react';
import { useGetStudentAssignmentsQuery } from '../../../../services/studentApi';
import { AlertCircle } from 'lucide-react';
import AssignmentCard from './AssignmentCard';
import AssignmentModals from './AssignmentModals'
;
import Spinner from '../../../comman/Spinner';

const StudentAssignmentList: React.FC = () => {
  const { data, isLoading, isError, error } = useGetStudentAssignmentsQuery();
  const [activeModal, setActiveModal] = useState<{ type: 'view' | 'submit', data: any } | null>(null);

  if (isLoading) return (
    <div className="flex justify-center items-center h-[400px]">
      <Spinner />
    </div>
  );

  if (isError) return (
    <div className="p-10 text-center text-red-600 font-black uppercase text-[10px]">
      <AlertCircle className="inline-block mr-2" size={14} />
      {(error as any)?.data?.message || "Error loading data."}
    </div>
  );

  const assignments = data?.data || [];

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-10">
          Academic <span className="text-orange-600">Assignments</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((item: any) => (
            <AssignmentCard 
              key={item._id} 
              item={item} 
              onView={(data) => setActiveModal({ type: 'view', data })}
              onSubmit={(data) => setActiveModal({ type: 'submit', data })}
            />
          ))}
        </div>

        {activeModal && (
          <AssignmentModals 
            type={activeModal.type} 
            data={activeModal.data} 
            onClose={() => setActiveModal(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default StudentAssignmentList;