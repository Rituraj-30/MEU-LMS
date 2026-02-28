import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaBullseye, FaEye } from "react-icons/fa";

interface Student {
  name: string;
  package: string;
  img: string;
}

const MUSuccessSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const placementData: Student[] = [
    {
      name: "Rehan Khan",
      package: "₹6 LPA",
      img: "https://res.cloudinary.com/dnkhmmcgf/image/upload/v1771348213/Screenshot_2026-02-17_223949_tpzhda.png"
    },
    {
      name: "Deepeh Saini",
      package: "₹6 LPA ",
      img: "https://res.cloudinary.com/dnkhmmcgf/image/upload/v1771348212/Screenshot_2026-02-17_223846_govacm.png"
    },
    {
      name: "Tohida Bee",
      package: "₹6 LPA",
      img: "https://res.cloudinary.com/dnkhmmcgf/image/upload/v1771347863/Screenshot_2026-02-17_223345_celddo.png"
    },
    {
      name: "Prachi Shukla",
      package: "₹6 LPA",
      img: "https://res.cloudinary.com/dnkhmmcgf/image/upload/v1771348515/Screenshot_2026-02-17_224455_j1s1cs.png"
    },
  ];

  const nextPlacement = (): void => {
    setCurrentSlide((prev) => (prev === placementData.length - 1 ? 0 : prev + 1));
  };

  const prevPlacement = (): void => {
    setCurrentSlide((prev) => (prev === 0 ? placementData.length - 1 : prev - 1));
  };

  return (
    <div className="w-full bg-white font-sans">
      {/* 1. VISION & MISSION SECTION */}
      <div className="max-w-[1400px] mx-auto px-6 py-5 border border-slate-200 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          
          {/* Vision */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-orange-600">
              <FaEye size={24} />
              <h3 className="text-2xl font-black uppercase tracking-tight">Vision</h3>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium text-[15px]">
              To be a globally recognized institution that fosters innovation, cultivates leaders, 
              and inspires a passion for lifelong learning. We aim to empower our diverse 
              community of students, faculty, and staff to address the challenges of the 21st 
              century with knowledge, integrity, and a commitment to positive societal impact.
            </p>
          </div>

          {/* Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-orange-600">
              <FaBullseye size={22} />
              <h3 className="text-2xl font-black uppercase tracking-tight">Mission</h3>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium text-[15px]">
              Our mission at Mandsaur University is to provide a transformative educational 
              experience that combines academic rigor with practical skills, nurtures a diverse 
              and inclusive community, promotes groundbreaking research, and instills a commitment 
              to ethical leadership and social responsibility. We strive to empower our students 
              to contribute meaningfully to local and global communities.
            </p>
          </div>
        </div>
      </div>

      {/* 2. PLACEMENT SLIDER SECTION */}
      <div className="w-full bg-slate-950 py-10 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left: Text Content */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h4 className="text-orange-500 font-bold tracking-[0.3em] uppercase text-sm">Placement Excellence</h4>
                <h2 className="text-white text-4xl md:text-5xl font-black leading-[1.1]">
                  Student Success: <br />
                  <span className="text-orange-500">Classroom to Career</span>
                </h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                  Our students stand out with exceptional placements, driven by industry collaborations and hands-on exposure.
                </p>
              </div>
              
              {/* Slider Controls */}
              <div className="flex gap-4 justify-center lg:justify-start">
                <button 
                  type="button"
                  onClick={prevPlacement} 
                  className="w-10 h-10 rounded-full border-2 border-slate-800 text-white flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all"
                  aria-label="Previous Student"
                >
                  <FaChevronLeft size={15} />
                </button>
                <button 
                  type="button"
                  onClick={nextPlacement} 
                  className="w-10 h-10 rounded-full border-2 border-slate-800 text-white flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all"
                  aria-label="Next Student"
                >
                  <FaChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* Right: The Image Slider */}
            <div className="flex-[1.5] w-full overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-out gap-8"
                style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
              >
                {placementData.map((student: Student, idx: number) => (
                  <div key={idx} className="min-w-[100%] md:min-w-[45%] lg:min-w-[31%] flex flex-col group">
                    {/* Image Box */}
                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-800 mb-6 border-4 border-slate-900 transition-all duration-300 shadow-2xl">
                      <img 
                        src={student.img} 
                        alt={student.name}
                        className="w-full h-full object-cover transition-transform duration-700"
                      />
                    </div>
                    {/* Text Below Image */}
                    <div className="px-2">
                      <h4 className="text-white font-bold text-xl mb-1">{student.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-8 bg-orange-600 rounded-full"></div>
                        <p className="text-orange-500 font-black text-sm tracking-wide">{student.package}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MUSuccessSection;