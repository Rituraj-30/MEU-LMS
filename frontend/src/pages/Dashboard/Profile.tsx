import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import UpdatePasswordModal from "./UpdatePassword"; 
import { useUpdateProfileImageMutation } from "../../services/authApi";
import { setCredentials } from "../../redux/slices/authSlice";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaUsers,
  FaPhoneAlt,
  FaCamera,
  FaSpinner,
  FaLock,
} from "react-icons/fa";


const InfoRow = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: any;
  icon: any;
}) => (
  <div className="flex items-center border-b border-gray-100 py-3 text-[13px]">
    <div className="w-8 text-gray-400">
      <Icon size={14} />
    </div>

    <div className="w-48 font-semibold text-gray-500 uppercase tracking-tight">
      {label}
    </div>

    <div className="flex-1 text-slate-800 font-medium">{value || "—"}</div>
  </div>
);

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateImage, { isLoading: isUpdating }] =
    useUpdateProfileImageMutation();

  if (!user) return null;

  const role = user.role;

  const isTeacher = role === "Staff" || role === "Hod";

  const isStudent = role === "Student";

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("profileImage", file);

    try {
      const response = await updateImage(formData).unwrap();

      if (response.success && response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));

        dispatch(
          setCredentials({
            user: response.data,
            // ERROR FIX: Added ?? "" to handle potential undefined value
            token: localStorage.getItem("token")?.replace(/"/g, "") ?? "",
          }),
        );

        toast.success("Profile picture updated!");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update image");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* 🛡️ Password Update Modal */}

      <UpdatePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      

          <div className="p-2 border-b border-gray-100 flex items-center gap-6 ">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <img
                src={
                  user.profileimg ||
                  `https://api.dicebear.com/5.x/initials/svg?seed=${user.name}`
                }
                className={`w-20 h-20 rounded-md border border-gray-200 object-cover shadow-sm bg-white transition-all group-hover:brightness-75 ${isUpdating ? "opacity-50" : "opacity-100"}`}
                alt="profile"
              />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaCamera className="text-white shadow-md" />
              </div>

              {isUpdating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                  <FaSpinner className="animate-spin text-teal-600" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
                {user.name}
              </h1>

              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  {role}
                </span>

                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <FaEnvelope size={10} /> {user.email}
                </span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>


            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 text-[11px] font-bold text-slate-700 border border-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all shadow-sm uppercase tracking-wider"
            >
              <FaLock className="text-orange-500" /> Change Password
            </button>
          </div>

          {/* 🔷 Details Section */}

          <div className="p-6">
            <h2 className="text-blue-700 font-bold text-sm border-b border-blue-100 pb-2 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <FaIdCard /> Personal & Academic Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
              <div className="flex flex-col">
                <InfoRow
                  label={isTeacher ? "Teacher Id " : "Roll Number"}
                  value={
                    user.teacherDetails?.TeacherId ||
                    user.studentDetails?.rollNo
                  }
                  icon={FaIdCard}
                />

                <InfoRow label="Full Name" value={user.name} icon={FaUser} />

                <InfoRow
                  label="Email Address"
                  value={user.email}
                  icon={FaEnvelope}
                />

                {isTeacher && (
                  <>
                    <InfoRow
                      label="Designation"
                      value={user.teacherDetails?.designation}
                      icon={FaBriefcase}
                    />

                    <InfoRow
                      label="Experience"
                      value={`${user.teacherDetails?.experience} Years`}
                      icon={FaBriefcase}
                    />
                  </>
                )}

                {isStudent && (
                  <>
                    <InfoRow
                      label="Parent Name"
                      value={user.studentDetails?.parentName}
                      icon={FaUsers}
                    />

                    <InfoRow
                      label="Parent Contact"
                      value={user.studentDetails?.parentContact}
                      icon={FaPhoneAlt}
                    />
                  </>
                )}
              </div>

              <div className="flex flex-col">
                <InfoRow
                  label="Verification Status"
                  value="Active / Verified"
                  icon={FaIdCard}
                />

                {isTeacher && (
                  <InfoRow
                    label="Specialization"
                    value={
                      user.teacherDetails?.specialization?.length
                        ? user.teacherDetails.specialization.join(", ")
                        : "General"
                    }
                    icon={FaGraduationCap}
                  />
                )}

                {isStudent && (
                  <>
                    <InfoRow
                      label="Current Year"
                      value={`Year ${user.studentDetails?.currentYear}`}
                      icon={FaGraduationCap}
                    />

                    <InfoRow
                      label="Current Semester"
                      value={`Semester ${user.studentDetails?.currentSem}`}
                      icon={FaGraduationCap}
                    />

                    <div className="flex items-start border-b border-gray-100 py-3 text-[13px]">
                      <div className="w-8 text-gray-400 mt-1">
                        <FaMapMarkerAlt size={14} />
                      </div>

                      <div className="w-48 font-semibold text-gray-500 uppercase tracking-tight">
                        Residential Address
                      </div>

                      <div className="flex-1 text-slate-800 font-medium leading-relaxed">
                        {user.studentDetails?.address}
                      </div>
                    </div>
                  </>
                )}

                <InfoRow
                  label="Member Since"
                  value={new Date(user.createdAt).toLocaleDateString()}
                  icon={FaIdCard}
                />
              </div>
            </div>

     

            <div className="mt-8 bg-amber-50 border border-amber-100 p-4 rounded-sm flex justify-between items-center">
              <p className="text-[11px] text-amber-700 italic font-medium">
                * Identification and academic details are synced with University
                ERP.
              </p>

              <span className="text-[10px] font-bold text-amber-600 uppercase">
                Last Updated: {new Date(user.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      
  );
};

export default Profile;