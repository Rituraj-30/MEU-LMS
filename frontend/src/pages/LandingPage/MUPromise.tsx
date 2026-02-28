import React, { useState, useRef,  type ReactNode } from "react";
import { 
  FaBrain, FaGlobeAmericas, FaMicrochip, 
  FaUserGraduate, FaRocket, FaShieldAlt, 
  FaVolumeMute, FaVolumeUp 
} from "react-icons/fa";

// --- Interfaces for Type Safety ---
interface Discipline {
  title: string;
  items: string[];
  more: boolean;
}

interface Feature {
  id: number;
  title: string;
  desc: string;
  icon: ReactNode; // Since icons are JSX elements
}

const MUPromise: React.FC = () => {
  // TypeScript Ref for Video Element
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Video ko rokne aur chalane ke liye function
  const togglePlay = (): void => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Sound toggle karne ke liye function with Event Type
  const toggleMute = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation(); 
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const disciplines: Discipline[] = [
    {
      title: "Engineering & Tech",
      items: ["Computer Science (CSE)", "AI & Machine Learning", "Data Science", "Cyber Security", "Cloud Computing", "Mechanical Engg."],
      more: true
    },
    {
      title: "Health & Sciences",
      items: ["Pharmacy", "Microbiology", "Agriculture Science", "Biotechnology", "Forensic Science", "Physiotherapy"],
      more: true
    },
    {
      title: "Management & Commerce",
      items: ["MBA / BBA", "Digital Marketing", "Financial Markets", "Banking & Insurance", "Hotel Management", "Business Analytics"],
      more: true
    },
    {
      title: "Arts, Law & Design",
      items: ["Fashion Design", "Interior Design", "Journalism & MC", "Integrated Law (B.A. LLB)", "Liberal Arts", "Fine Arts"],
      more: true
    }
  ];

  const features: Feature[] = [
    { id: 1, title: "Industry-Led Curriculum", desc: "Courses updated with latest industry trends and tech stack.", icon: <FaBrain /> },
    { id: 2, title: "Global Opportunities", desc: "Partnerships with 50+ international universities for exchange.", icon: <FaGlobeAmericas /> },
    { id: 3, title: "Center of Excellence", desc: "Dedicated research labs for AI, Robotics, and IoT.", icon: <FaMicrochip /> },
    { id: 4, title: "Career Transformation", desc: "Holistic training for placements, UPSC, and GATE.", icon: <FaUserGraduate /> },
    { id: 5, title: "Idea to Startup", desc: "In-house incubation center to turn your ideas into business.", icon: <FaRocket /> },
    { id: 6, title: "24/7 Secure Campus", desc: "Safe, green and smart campus with ultra-modern amenities.", icon: <FaShieldAlt /> },
  ];

  return (
    <div className="w-full bg-slate-50 font-sans py-16">
      {/* SECTION 1: Programmes List */}
      <div className="max-w-[1400px] mx-auto px-6 mb-20 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
          150+ <span className="text-orange-600">Programmes</span> Across Multiple Disciplines
        </h2>
        <p className="text-slate-500 mb-12 max-w-3xl mx-auto font-medium">
          Choose from a wide range of industry-oriented courses designed to shape your future career and personal growth.
        </p>

        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
            {disciplines.map((group, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-orange-600 font-black text-xs tracking-[0.2em] uppercase border-b border-orange-100 pb-2">
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-start text-slate-600 hover:text-slate-950 cursor-pointer transition-all group">
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-2 mr-3 group-hover:bg-orange-500 group-hover:scale-125 transition-all"></span>
                      <span className="text-[13px] font-semibold leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: Future of Education with VIDEO */}
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Experience the <span className="text-orange-600">Future of Education</span>
          </h2>
          <div className="w-20 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          {/* Left: Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-[1.2]">
            {features.map((feature) => (
              <div 
                key={feature.id} 
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex gap-5 relative overflow-hidden"
              >
                <span className="absolute -right-2 -bottom-4 text-7xl font-black text-slate-50 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  0{feature.id}
                </span>
                
                <div className="w-12 h-12 flex-shrink-0 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                
                <div className="relative z-10">
                  <h4 className="text-slate-900 font-extrabold text-base mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-slate-500 text-[12px] leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Video Card */}
          <div className="flex-1 w-full flex flex-col">
            <div 
              className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white bg-black group cursor-pointer"
              onClick={togglePlay}
            >
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                src="https://meu.edu.in/wp-content/uploads/2025/01/Voice-over-website-video.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="metadata" 
                poster="https://meu.edu.in/wp-content/uploads/2023/07/campus-view.jpg"
              />

              <button 
                type="button"
                onClick={toggleMute}
                className="absolute bottom-6 right-6 z-20 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95"
              >
                {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
              </button>

              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="bg-black/40 text-white px-4 py-2 rounded-full text-xs font-bold">Click to Pause/Play</span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                Explore Our <span className="text-orange-600">Campus Life</span>
              </h2>
              <p className="text-slate-500 mt-3 font-medium text-base leading-relaxed">
                Take a virtual journey through Mandsaur University. Discover our world-class labs, 
                vibrant culture, and the innovative environment where leaders are born.
              </p>
              <div className="w-20 h-1.5 bg-orange-500 mt-6 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MUPromise;