import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaMapMarkerAlt, FaRocket } from "react-icons/fa";

// 1. Data Structure ke liye Interface
interface EventItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  date: string;
  tag: string;
  color: string;
  campus: string;
}

const eventData: EventItem[] = [
  { id: 1, title: "SPANDAN-2K26", subtitle: "Mega Cultural Fest Of MU", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600", date: "MAR 15-18", tag: "CULTURAL", color: "border-purple-500", campus: "CAMPUS 1" },
  { id: 2, title: "MAHARAAS-2k26", subtitle: "Grand Garba Night", image: "https://images.unsplash.com/photo-1514525253361-bee8718a74a2?w=600", date: "FEB 28", tag: "CAMPUS LIFE", color: "border-orange-500", campus: "CAMPUS 2" },
  { id: 3, title: "PLACEMENT DRIVE", subtitle: "Top MNCs visiting for 2026 Batch", image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600", date: "MAR 10", tag: "PLACEMENT", color: "border-green-600", campus: "CAMPUS 1" },
  { id: 4, title: "TECH-TRONIX", subtitle: "National Level Hackathon", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600", date: "MAR 05", tag: "TECHNICAL", color: "border-blue-500", campus: "CAMPUS 1" },
  { id: 5, title: "HOLI DHAMAKA", subtitle: "Festival of Colors in Campus", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600", date: "MAR 14", tag: "FESTIVAL", color: "border-red-500", campus: "CAMPUS 1" },
  { id: 6, title: "CONVOCATION '26", subtitle: "The Graduation Ceremony", image: "https://res.cloudinary.com/dnkhmmcgf/image/upload/v1771305063/2025_xnofoa.png", date: "MAY 10", tag: "ACADEMIC", color: "border-yellow-500", campus: "CAMPUS 1" },
  { id: 7, title: "RIVALRY WEEK", subtitle: "Annual Sports Championship", image: "https://res.cloudinary.com/dnkhmmcgf/image/upload/v1771305063/sports_eprjku.png", date: "AUG 29", tag: "SPORTS", color: "border-green-500", campus: "CAMPUS 2" },
];

const LatestEventsBox: React.FC = () => {
  const extendedData: EventItem[] = [...eventData, ...eventData, ...eventData];
  const [startIndex, setStartIndex] = useState<number>(eventData.length);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);

  // --- CONFIG ---
  const cardWidth: number = 280; 
  const gap: number = 12; 

  useEffect(() => {
    const timer = setInterval(() => nextSlide(), 4500);
    return () => clearInterval(timer);
  }, [startIndex]);

  useEffect(() => {
    if (startIndex === eventData.length * 2 || startIndex === 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setStartIndex(eventData.length);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setIsTransitioning(true);
    }
  }, [startIndex]);

  const nextSlide = () => setStartIndex((prev) => prev + 1);
  const prevSlide = () => setStartIndex((prev) => prev - 1);

  // Dynamic Color Helper
  const getBorderColor = (colorClass: string): string => {
    const color = colorClass.split('-')[1];
    switch(color) {
      case 'purple': return '#a855f7';
      case 'orange': return '#f97316';
      case 'green': return '#22c55e';
      case 'blue': return '#3b82f6';
      case 'red': return '#ef4444';
      case 'yellow': return '#eab308';
      default: return '#6366f1';
    }
  };

  return (
    <section className="w-full bg-white py-8 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex flex-col">
            <h2 className="text-slate-900 text-xl font-black uppercase border-l-4 border-orange-500 pl-3 leading-tight">
              Latest <span className="text-orange-600">Events</span>
            </h2>
            <p className="text-slate-400 text-[9px] mt-0.5 ml-4 tracking-widest font-bold">MU CAMPUS UPDATES</p>
          </div>
          <div className="flex gap-1.5">
            <button onClick={prevSlide} className="p-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-orange-500 hover:text-white transition-all border border-slate-200 shadow-sm">
              <FaChevronLeft size={12} />
            </button>
            <button onClick={nextSlide} className="p-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-orange-500 hover:text-white transition-all border border-slate-200 shadow-sm">
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Carousel Window */}
        <div className="relative">
          <div 
            className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
            style={{ 
              gap: `${gap}px`,
              transform: `translateX(-${startIndex * (cardWidth + gap)}px)` 
            }} 
          >
            {extendedData.map((item, index) => (
              <div 
                key={index}
                className="flex-shrink-0 relative rounded-lg overflow-hidden group border-b-4 bg-slate-900 shadow-md"
                style={{ 
                    width: `${cardWidth}px`, 
                    height: '180px',
                    borderColor: getBorderColor(item.color)
                }}
              >
                <img src={item.image} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>

                {/* Tag */}
                <div className="absolute top-2 left-2">
                  <span className="bg-orange-600 text-[8px] font-bold px-1.5 py-0.5 rounded text-white uppercase shadow-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-3 flex flex-col justify-end">
                  <h3 className="text-white text-base font-bold tracking-tight group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
                    {item.tag === "PLACEMENT" && <FaRocket size={12} className="text-orange-500"/>}
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-[9px] mt-0.5 font-normal line-clamp-1 opacity-90">
                    {item.subtitle}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2 text-[8px] font-bold text-orange-400">
                    <span className="flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded">
                      <FaCalendarAlt size={9} className="text-white/70"/> {item.date}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 uppercase tracking-tighter">
                      <FaMapMarkerAlt size={9}/> {item.campus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-1 mt-5">
          {eventData.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setStartIndex(i + eventData.length)}
              className={`h-1 rounded-full transition-all duration-300 ${ (startIndex % eventData.length) === i ? "w-6 bg-orange-500" : "w-1.5 bg-slate-200 hover:bg-slate-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestEventsBox;