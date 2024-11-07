import React from "react";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { getInitails } from "..//../utils/helper";

const ProfileInfo = ({ userInfo, onLogOut }) => {
  return (
    userInfo && (
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-700 font-bold bg-green-300">
          {getInitails(userInfo ? userInfo.fullName : "")}
        </div>

        <div className="">
          <p className="text-sm font-semibold text-cyan-700">
            {userInfo.fullName || ""}
          </p>
        </div>
        <button
          className="text-sm bg-gray-100 rounded-full p-1 text-green-700 transition-transform duration-300 ease-in-out transform hover:scale-105 hover:text-white hover:bg-green-800"
          onClick={onLogOut}
        >
          <LogoutOutlinedIcon />
        </button>
      </div>
    )
  );
};

export default ProfileInfo;
