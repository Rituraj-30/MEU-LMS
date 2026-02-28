import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice"; 
import type { RootState } from "../../redux/store"; 
import {
  FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn,
  FaTwitter, FaBars, FaTimes, FaSignOutAlt,
} from "react-icons/fa";

import logo from "../../assets/imgg/logobg.png";



const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux se data nikalna
  const { token, user } = useSelector((state: RootState) => state.auth);
  
  // Strict check: Agar token aur user dono hain tabhi login maano
  const isLoggedIn = !!token && !!user; 

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/login");
  };

  const socialIcons = [
    { icon: <FaFacebookF />, link: "#" },
    { icon: <FaTwitter />, link: "#" },
    { icon: <FaInstagram />, link: "#" },
    { icon: <FaYoutube />, link: "#" },
    { icon: <FaLinkedinIn />, link: "#" },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 🔶 Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto md:h-14 object-contain cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate("/")}
            />
          </div>

          {/* 🔷 Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-5">
                {/* 🟢 Yahan onClick Dashboard ke liye add kiya hai */}
                <div 
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-3 bg-gray-50/50 pl-4 pr-2 py-1.5 rounded-full border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all"
                >
                  <div className="flex flex-col text-right">
                    <p className="text-teal-700 font-extrabold text-sm leading-tight uppercase tracking-tight">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-orange-600 font-bold uppercase tracking-tighter">
                      {user?.role }
                    </p>
                  </div>
                  <div className="relative group">
                    <img 
                      src={user?.profileimg || `https://api.dicebear.com/5.x/initials/svg?seed=${user?.name}`} 
                      alt="Profile" 
                      className="w-10 h-10 object-cover rounded-full border-2 border-white shadow-md ring-1 ring-gray-200 group-hover:ring-orange-400 transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                  title="Logout"
                >
                  <FaSignOutAlt size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  {socialIcons.map((item, i) => (
                    <a key={i} href={item.link} className="p-2 text-gray-400 hover:text-orange-500 transition-all">
                      {item.icon}
                    </a>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 font-bold text-xs uppercase tracking-widest"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {/* 📱 Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setOpen(!open)} className="text-gray-600 p-2">
              {open ? <FaTimes size={28} /> : <FaBars size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Menu Dropdown */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-2xl absolute w-full left-0 z-50">
          <div className="flex flex-col p-6 gap-6">
            {isLoggedIn ? (
              <div className="flex flex-col gap-6">
                {/* 🟢 Mobile mein bhi Profile section par click add kiya hai */}
                <div 
                  onClick={() => { navigate("/dashboard"); setOpen(false); }}
                  className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-inner cursor-pointer"
                >
                  <img 
                    src={user?.profileimg || `https://api.dicebear.com/5.x/initials/svg?seed=${user?.name}`} 
                    alt="Profile" 
                    className="w-16 h-16 object-cover rounded-2xl border-2 border-white shadow-md"
                  />
                  <div>
                    <p className="text-teal-800 font-black text-xl leading-tight uppercase">{user?.name}</p>
                    <p className="text-orange-600 font-bold text-xs uppercase tracking-widest mt-1">{user?.role}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white py-4 rounded-xl font-black flex items-center justify-center gap-3 shadow-lg shadow-red-100 active:scale-95 transition-all"
                >
                  <FaSignOutAlt /> LOGOUT
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="flex justify-center gap-6">
                  {socialIcons.map((item, i) => (
                    <a key={i} href={item.link} className="text-gray-400 text-2xl p-2">{item.icon}</a>
                  ))}
                </div>
                <button 
                  onClick={() => {navigate("/login"); setOpen(false);}}
                  className="bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg uppercase tracking-widest"
                >
                  Login to Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;