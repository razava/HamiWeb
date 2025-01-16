import { ClipboardList, EyeOff, Info, User, UserCheck  } from "lucide-react";
import React from "react";

export default function BoxDashboard({
  value,
  title,
}: {
  value: string;
  title: string;
  }) {
  
  const boxIcons = {
    "جلسات برگزار شده": <EyeOff className=" mb-2 mx-auto" />,
    "گروه های عضو": <UserCheck className=" mb-2 mx-auto" />,
    "کاربران جلسات": <ClipboardList className=" mb-2 mx-auto" />,
  };

  const checkIcon = boxIcons[title as keyof typeof boxIcons] ? (
    boxIcons[title as keyof typeof boxIcons]
  ) : (
    <Info className=" mb-2 mx-auto" />
  );

  return (
    <div
      className=" px-7 py-8 bg-zinc-100 rounded-lg shadow flex flex-col justify-evenly items-center text-black
      transition duration-200        
      hover:text-white hover:bg-blue
       group h-44 w-44"
    >
      {checkIcon ? checkIcon : <Info className=" mb-2 mx-auto" />}
      {/* <EyeOff className=" mb-2 mx-auto" /> */}
      <div className="group-hover:-translate-y-2 flex flex-col justify-center transition-all duration-300">
        <p className="text-center text-sm font-medium">{value}</p>
        <p className="text-center text-xs font-medium">{title}</p>
      </div>
    </div>
  );
}
