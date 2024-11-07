import React from "react";
import { MdOutlineHistoryEdu } from "react-icons/md";
import { MdSearchOff } from "react-icons/md";
import { MdOutlineDateRange } from "react-icons/md";

const EmptyCard = ({ message, type }) => {
  const icon = (type) => {
    if (type === "search") return <MdSearchOff />;
    else if (type === "date") return <MdOutlineDateRange />;
    else return <MdOutlineHistoryEdu />;
  };
  return (
    <div className="flex flex-col items-center justify-center mt-20 ml-55">
      <div className="bg-gray-300 rounded-full">
        <div className="text-[50px] p-2 text-cyan-500 rounded-full">
          {icon(type)}
        </div>
      </div>
      <p className="w-1/2 text-l font-medium text-slate-700 text-center leading-7 mt-2">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
