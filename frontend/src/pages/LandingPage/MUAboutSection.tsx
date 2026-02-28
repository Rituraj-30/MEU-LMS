import React, { useState, useEffect } from "react";

const MUAboutSection: React.FC = () => {
  const [currentImg, setCurrentImg] = useState<number>(0);

  const carouselImages: string[] = [
    "https://res.cloudinary.com/dnkhmmcgf/image/upload/v1771345825/Screenshot_2026-02-17_215441_ksh9kz.png", 
    "https://res.cloudinary.com/dnkhmmcgf/image/upload/v1771305063/2025_xnofoa.png",
    "https://res.cloudinary.com/dnkhmmcgf/image/upload/v1771345850/Screenshot_2026-02-17_215537_cgjnvk.png", 
    "https://res.cloudinary.com/dnkhmmcgf/image/upload/v1771345836/Screenshot_2026-02-17_215631_ij1sjv.png"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  return (
    <div className="w-full bg-white py-12 font-sans">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Top Heading Block */}
        <div className="text-center mb-12">
          <h3 className="text-orange-600 font-bold text-sm tracking-[0.3em] uppercase mb-4">
            A Campus That Every Student Loves
          </h3>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            Nurturing Excellence in <span className="text-orange-600">Harmony with Nature</span>
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          
          {/* LEFT: About Content with Subtle BG */}
          <div className="flex-1 space-y-6 bg-slate-50 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">
              About <span className="text-orange-600">Mandsaur University</span>
            </h3>
            
            <div className="space-y-5 text-slate-600 leading-relaxed text-[15px] font-medium">
              <p>
                Mandsaur University (MU) was established under the <span className="text-slate-900 font-bold">M.P. Act No. 17 of 2015</span> of The Madhya Pradesh Niji Vishwavidyalaya Sanshodhan Adhiniyam, 2015. Although MU is the youngest university in the region, it has over <span className="text-orange-600 font-bold">two decades of distinguished experience</span> in providing quality education through its 12 institutes spread over 900,000 square feet of lush green campuses.
              </p>
              <p>
                MU has well-qualified faculty members with industry and academic experience to train young minds in diverse disciplines, including <span className="text-slate-800 font-bold text-[14px]">Engineering, Pharmacy, Management, Commerce, Computer Applications, Agriculture, Life Sciences, Ayush, Education, Fashion Design, Tourism & Hospitality, Physical Education, Journalism & Mass Communication.</span>
              </p>
              <p>
                The university has state-of-the-art laboratories fully equipped with modern equipment for study and research in various disciplines.
              </p>
            </div>
          </div>

          {/* RIGHT: Image Carousel Section */}
          <div className="flex-1 w-full flex flex-col">
            <div className="mb-4">
               <h4 className="text-slate-900 font-black text-xl md:text-2xl uppercase tracking-tighter">
                CONVOCATION <span className="text-orange-600">2K25</span> GLIMPSES
              </h4>
              <div className="w-12 h-1 bg-orange-500 mt-1 rounded-full"></div>
            </div>

            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[8px] border-white bg-slate-100 aspect-[4/3] group">
              {/* Carousel Images */}
              {carouselImages.map((img: string, index: number) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentImg ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={img}
                    alt={`University Highlight ${index + 1}`}
                    className="w-full h-full object-cover transform transition-transform duration-[5000ms] group-hover:scale-110"
                  />
                </div>
              ))}

              {/* Navigation Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {carouselImages.map((_, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImg(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentImg ? "w-8 bg-orange-500" : "w-2 bg-white/50"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Caption under Image */}
            <div className="mt-6 flex items-center gap-4 px-2">
              <div className="h-px flex-1 bg-slate-200"></div>
              <p className="text-slate-400 text-sm font-medium italic">Celebrating Academic Success</p>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MUAboutSection;