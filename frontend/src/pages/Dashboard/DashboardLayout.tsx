import { Outlet } from 'react-router-dom';
import SecondaryNavbar from './SecondaryNavbar'; 

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
    
      <SecondaryNavbar /> 
      
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-sm">

        
          <div className="p-6">
            <Outlet /> 
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;