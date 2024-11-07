import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-slate-100 rounded-xl border border-cyan-300 hover:shadow-cyan-700">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-xs bg-transparent py-[11px] outline-none"
        value={value}
        onChange={onChange}
      />
      {value && (
        <IoMdClose
          className="text-xl mr-2 text-gray-400 cursor-pointer hover:text-green-600 hover:font-semibold"
          onClick={onClearSearch}
        />
      )}

      <FaMagnifyingGlass
        className="text-gray-400 cursor-pointer hover:text-green-600 hover:font-semibold"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
