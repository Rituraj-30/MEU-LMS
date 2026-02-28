import React from "react";
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaArrowRight, 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaInstagram 
} from "react-icons/fa";
import type { IconType } from "react-icons";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialIcon {
  Icon: IconType;
  href: string;
}

const MUFooter: React.FC = () => {
  const quickLinks: FooterLink[] = [
    { label: 'Career', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Alumni', href: '#' },
    { label: 'Happenings', href: '#' },
  ];

  const exploreLinks: FooterLink[] = [
    { label: 'MU Advantage', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Apply Now', href: '#' },
    { label: 'About US', href: '#' },
  ];

  const socialIcons: SocialIcon[] = [
    { Icon: FaFacebookF, href: "#" },
    { Icon: FaTwitter, href: "#" },
    { Icon: FaLinkedinIn, href: "#" },
    { Icon: FaInstagram, href: "#" },
  ];

  return (
    <footer className="w-full bg-white text-slate-900 pt-14 pb-8 font-sans border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Adjusted Grid: column 2 and 3 are tighter to give space to column 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_0.8fr_1.2fr_1.5fr] gap-6 mb-10">
          
          {/* Column 1: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-black border-l-4 border-orange-600 pl-4 uppercase tracking-wider text-slate-900">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-500 hover:text-orange-600 hover:pl-2 transition-all duration-300 flex items-center gap-2 font-medium text-sm">
                    <FaArrowRight size={10} className="text-orange-600" /> {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Explore (Thoda Narrow kiya hai) */}
          <div className="space-y-6">
            <h4 className="text-lg font-black border-l-4 border-orange-600 pl-4 uppercase tracking-wider text-slate-900">
              Explore
            </h4>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-500 hover:text-orange-600 hover:pl-2 transition-all duration-300 flex items-center gap-2 font-medium text-sm">
                    <FaArrowRight size={10} className="text-orange-600" /> {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Collaboration (Explore ke pass shift kiya) */}
          <div className="lg:pr-4"> 
            <p className="text-slate-500 text-[13px] leading-relaxed text-justify font-medium pt-0 lg:pt-12">
              The Microsoft CMT service was used for managing the peer-reviewing process for university conferences. 
              This service was provided for free by Microsoft and they bore all expenses.
            </p>
          </div>

          {/* Column 4: Mandsaur University (Ab ye break nahi hoga) */}
          <div className="space-y-6">
            <h4 className="text-lg font-black border-l-4 border-orange-600 pl-4 uppercase tracking-wider text-slate-900 whitespace-nowrap">
              Mandsaur University
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="mt-1 w-7 h-7 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <FaMapMarkerAlt size={12} />
                </div>
                <p className="text-slate-500 text-sm font-medium leading-snug">
                  By Pass Square, Revas Devda Road, S.H.-31, Mandsaur (M.P) - 458001
                </p>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-7 h-7 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <FaEnvelope size={12} />
                </div>
                <a href="mailto:admissions@meu.edu.in" className="text-slate-500 text-sm hover:text-orange-600 font-medium whitespace-nowrap">
                  admissions@meu.edu.in
                </a>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="mt-1 w-7 h-7 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <FaPhoneAlt size={12} />
                </div>
                <div className="text-slate-500 text-sm font-bold leading-tight">
                  <p className="whitespace-nowrap">Admissions: +91 9424489426</p>
                  <p className="whitespace-nowrap pt-1">Reception: +91 9752122999</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-[11px] text-center md:text-left font-medium">
            © {new Date().getFullYear()} Mandsaur University by B.R. Nahata Smriti Sansthan. 
            <span className="ml-1 italic text-slate-300">All Rights Reserved.</span>
          </p>
          
          <button 
            type="button"
            className="flex items-center gap-2 bg-slate-900 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full font-bold text-xs transition-all shadow-lg active:scale-95"
          >
            <FaMapMarkerAlt /> GET DIRECTION
          </button>

          <div className="flex items-center gap-3">
            {socialIcons.map(({ Icon, href }, idx) => (
              <a 
                key={idx} 
                href={href} 
                className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-600 hover:text-white transition-all duration-300 border border-slate-100"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MUFooter;