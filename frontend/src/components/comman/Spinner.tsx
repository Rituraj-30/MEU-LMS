import { FaSpinner } from "react-icons/fa";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-[300px]">
         <FaSpinner className="animate-spin text-2xl text-orange-600" />
       </div>
  )
}

