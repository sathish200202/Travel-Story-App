import React from "react";
import LOGO from "../../public/images/logoo.jpg";
import ProfileInfo from "./Cards/ProfileInfo";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./input/SearchBar";

const NavBar = ({
  userInfo,
  searchQuery,
  setSearchQuery,
  handleClearSearch,
  onSearchNote,
}) => {
  const navigate = useNavigate();
  const isToken = localStorage.getItem("token");
  const onLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  //handle the search
  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  //handle clear search
  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 shadow-lg sticky top-0 z-10">
      <Link to="/">
        <img src={LOGO} alt="logo" className="rounded-full w-20" />
      </Link>

      {/* <h2
        className="flex-1 text-center font-bold text-5xl text-teal-800 transition-transform duration-300 ease-in-out transform hover:scale-105"
        id="title"
      >
        TRAVEL STORY
      </h2> */}
      {isToken && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />
        </>
      )}
    </div>
  );
};

export default NavBar;
