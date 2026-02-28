import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import { setCredentials } from "../../redux/slices/authSlice"; 
import { useLoginMutation } from "../../services/authApi";
import logo from "../../assets/imgg/logobg.png";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import Spinner from "../comman/Spinner"; 

interface InputGroupProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  label, type, placeholder, value, onChange,
  showPasswordToggle, isPasswordVisible, onTogglePassword,
}) => (
  <div className="space-y-1 w-full text-left relative">
    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={showPasswordToggle ? (isPasswordVisible ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 
        focus:bg-white/10 focus:border-orange-500/50 
        rounded-lg outline-none transition-all text-[13px] text-white 
        placeholder:text-gray-600 backdrop-blur-sm pr-10"
        required
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
        >
          {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  </div>
);

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const bgImage = "https://res.cloudinary.com/dnkhmmcgf/image/upload/v1771494127/Gemini_Generated_Image_tughpntughpntugh_u5bi7u.png";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Verifying your account...");
    
    try {
      const response = await login({
        email: formData.identifier,
        password: formData.password,
      }).unwrap();

      dispatch(setCredentials({ 
        user: response.user, 
        token: response.token 
      }));

      toast.success(`Welcome back, ${response.user.name}!`, { id: toastId });
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Invalid credentials. Please try again.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="h-screen w-full relative flex items-stretch justify-end overflow-hidden font-sans bg-black">
      {/* Background Section */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Hero Content (Left Side) */}
      <div className="absolute bottom-20 left-10 md:left-16 z-10 hidden lg:block text-white max-w-lg">
        <h1 className="text-3xl xl:text-4xl font-black uppercase leading-tight drop-shadow-2xl">
          Mandsaur <br /> <span className="text-orange-600">University</span>
        </h1>
        <div className="h-1.5 w-20 bg-orange-600 mt-3 rounded-full" />
        <p className="text-gray-300 text-[10px] mt-3 tracking-[0.5em] uppercase font-medium">
          Making Future Ready
        </p>
      </div>

      {/* Login Sidebar (Right Side) */}
      <div className="w-full sm:w-[450px] lg:w-[420px] h-full relative z-20 flex flex-col justify-center items-center px-10 bg-black/40 backdrop-blur-2xl border-l border-white/5 shadow-2xl">
        <div className="w-full max-w-[320px] flex flex-col">
          <div className="mb-10 flex justify-start">
            <img
              src={logo}
              alt="MU Logo"
              className="max-w-[260px] h-auto brightness-125"
            />
          </div>

          <div className="mb-8 text-left">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Portal Login
            </h2>
            <p className="text-gray-400 text-[12px] mt-1">
              Enter your details to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputGroup
              label="Email / Identifier"
              type="text"
              placeholder="Enter your email"
              value={formData.identifier}
              onChange={(e) =>
                setFormData({ ...formData, identifier: e.target.value })
              }
            />

            <InputGroup
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              showPasswordToggle={true}
              isPasswordVisible={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <div className="flex justify-end">
              <a
                href="#"
                className="text-[10px] text-gray-500 hover:text-orange-500 uppercase tracking-widest font-bold transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[50px] bg-white text-black font-black text-[12px] rounded-xl 
              hover:bg-orange-600 hover:text-white uppercase tracking-[0.2em]
              transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 mt-4 shadow-xl disabled:opacity-50"
            >
              {isLoading ? (
                <div className="scale-50 h-full flex items-center justify-center">
                   <Spinner />
                </div>
              ) : (
                "Enter Portal"
              )}
            </button>
          </form>

          <div className="mt-16 pt-6 border-t border-white/10 text-center">
            <p className="text-[9px] text-gray-600 tracking-[0.3em] uppercase">
              © 2026 Mandsaur University
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;