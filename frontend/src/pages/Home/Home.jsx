import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { gotEmptyCardMessage } from "../../utils/helper";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [searchQuery, setSearchQuery] = useState();
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const navigate = useNavigate();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openAndViewModal, setOpenAddViewModal] = useState({
    isShown: false,
    data: null,
  });

  //GET USER INFO
  const getUserInfo = async () => {
    //console.log("getuser function called");
    try {
      const res = await axiosInstance.get("/auth/profile");
      //console.log("User info:", res.data.user);
      if (res.data && res.data.user) {
        //Set user info if data exists
        setUserInfo(res.data.user);
      }
    } catch (error) {
      console.log("Error in getUserInfo: ", error);
      if (error.response.status === 401) {
        //clear storage if unauthorized
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //get all travel story
  const getAllTravelStories = async () => {
    try {
      const res = await axiosInstance.get("/story");
      //console.log("stories: ", res);
      if (res.data && res.data.stories) {
        setAllStories(res.data.stories);
      }
    } catch (error) {
      console.log("Error in get All travel story ", error.message);
    }
  };

  //edit story click
  const handleEdit = async (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data });
  };

  //view story
  const handleViewStory = async (data) => {
    setOpenAddViewModal({ isShown: true, data });
  };

  //update is favourite
  const updateIsFavourite = async (storyData) => {
    //console.log("Fav func called");
    const storyId = storyData._id;

    try {
      const res = await axiosInstance.put(
        "/story/update-is-favoruite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );

      if (res.data && res.data.story) {
        toast.success("Story Updated Successfully");
        if (filterType === "search" && searchQuery) {
          onSearchStory(searchQuery);
        } else if (filterType === "date") {
          filterStoriesByDate(dateRange);
        } else {
          getAllTravelStories();
        }
      }
    } catch (error) {
      console.log("Error in is Favourite ", error.message);
    }
  };

  //delete the travel story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
      const res = await axiosInstance.delete(`/story/delete-story/${storyId}`);

      if (res.data && !res.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenAddViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      console.log("Error in deleting the story ", error.message);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        //handle unexpexted error
        setError("An unexpected error occured. Please try again");
      }
    }
  };

  //search story
  const onSearchStory = async (query) => {
    try {
      const res = await axiosInstance.get("/story/search", {
        params: { query },
      });

      if (res.data && res.data.stories) {
        setFilterType("search");
        setAllStories(res.data.stories);
      }
    } catch (error) {
      console.log("Error in Search Story ", error.message);
    }
  };

  //clear the search
  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  };

  //handle filter travel story by date range
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if (startDate && endDate) {
        const res = await axiosInstance.get("/story/filterby-date-range/", {
          params: { startDate, endDate },
        });

        if (res.data && res.data.stories) {
          //console.log("Condition ok in date range");
          //console.log("res: ", res.data.stories);
          setFilterType("date");
          setAllStories(res.data.stories);
        }
      }
    } catch (error) {
      console.log("Error in filterStoriesByDate ", error.messsage);
    }
  };

  //handle date range select
  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  };

  const resetFilter = () => {
    setDateRange({ from: null, to: null });
    setFilterType("");
    getAllTravelStories();
  };
  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []);
  return (
    <>
      <NavBar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto py-10">
        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={() => {
            resetFilter();
          }}
        />
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                      onClose={() => handleClose()}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyCard
                message={gotEmptyCardMessage(filterType)}
                type={filterType}
              />
            )}
          </div>
          <div className="w-[330px]">
            <div className="bg-slate-50 border-1 border-black shadow-lg shadow-gray-500 rounded-lg">
              <div className="p-3">
                <DayPicker
                  CaptionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pageNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add and Edit Travel Story Model */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>
      {/* View Travel Story Model */}
      <Modal
        isOpen={openAndViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box"
      >
        <ViewTravelStory
          type={openAndViewModal.type}
          storyInfo={openAndViewModal.data || null}
          onClose={() => {
            setOpenAddViewModal((prevState) => ({
              ...prevState,
              isShown: false,
            }));
          }}
          onEditClick={() => {
            setOpenAddViewModal((prevState) => ({
              ...prevState,
              isShown: false,
            }));
            handleEdit(openAndViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openAndViewModal.data || null);
          }}
        />
      </Modal>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  );
};

export default Home;
