import React, { useState } from "react";
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import DateSelector from "../../components/input/DateSelector";
import ImageSelector from "../../components/input/ImageSelector";
import TagInput from "../../components/input/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import { toast } from "react-toastify";
import uploadImage from "../../utils/uploadImage";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setstoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  );
  const [visistedDate, setVisitedDate] = useState(
    storyInfo?.visitedDate || null
  );
  const [error, setError] = useState(null);

  //update travel story
  const updateTravelStory = async () => {
    const storyId = storyInfo._id;
    try {
      let imageUrl = "";

      let postData = {
        title,
        story,
        visitedLocation,
        imageUrl: storyInfo.imageUrl || "",
        visitedDate: visistedDate
          ? moment(visistedDate).valueOf()
          : moment().valueOf(),
      };

      if (typeof storyImg === "object") {
        //Upload new image
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";

        postData = { ...postData, imageUrl: imageUrl };
      }

      const res = await axiosInstance.put(
        `story/update-story/${storyId}`,
        postData
      );
      console.log("data: ", res.data);
      if (res.data && res.data.story) {
        toast.success("Story Updated Successfully");

        //refresh stories
        getAllTravelStories();
        //Close modal or form
        onClose();
      }
    } catch (error) {
      console.log("Error in add new travel story ", error.message);
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

  //add new travel story
  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";

      //Upload image if present
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        //get image URL
        imageUrl = imgUploadRes.imageUrl || "";
        console.log("imageUrl: ", imageUrl);
      }
      const res = await axiosInstance.post("/story/add-travel-story", {
        title,
        story,
        visitedLocation,
        imageUrl: imageUrl || "",
        visitedDate: visistedDate
          ? moment(visistedDate).valueOf()
          : moment().valueOf(),
      });
      console.log("data: ", res.data);
      if (res.data && res.data.story) {
        toast.success("Story Added Successfully");

        //refresh stories
        getAllTravelStories();
        //Close modal or form
        onClose();
      }
    } catch (error) {
      console.log("Error in add new travel story ", error.message);
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

  const handleAddOrUpdateClick = () => {
    //console.log("Input data: ", {title, story, imageUrl, visitedLocation, visistedDate})

    if (!title) {
      setError("Please enter the Title");
      return;
    }
    if (!visistedDate) {
      setError("Please select the Date");
      return;
    }
    if (!story) {
      setError("Please enter the Story");
      return;
    }
    if (visitedLocation.length < 1) {
      setError("Please enter the Visited Location");
      return;
    }
    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };

  //delete story image are Update the story
  const handleDeleteImage = async () => {
    //deleting story image
    try {
      const deleteImgRes = await axiosInstance.delete("/story/delete-image", {
        params: { imageUrl: storyInfo.imageUrl },
      });

      if (deleteImgRes.data) {
        const storyId = storyInfo._id;

        const postData = {
          title,
          story,
          visitedLocation,
          visistedDate: moment().valueOf(),
          imageUrl: "",
        };
        //Updating story
        const res = await axiosInstance.put(
          `story/update-story/${storyId}`,
          postData
        );
        setstoryImg(null);
      }
    } catch (error) {}
  };
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          <span id="title">
            {type === "add" ? "Add Story" : "Update Story"}
          </span>
        </h5>
        <div>
          <div className="flex items-center gap-3 bg-green-100 p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg " />
                ADD STORY
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                  <MdUpdate className="text-lg" />
                  UPDATE STORY
                </button>
              </>
            )}

            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label htmlFor="" className="input-label">
            TITLE
          </label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="my-3">
            <DateSelector date={visistedDate} setDate={setVisitedDate} />
          </div>
          <ImageSelector
            image={storyImg}
            setImage={setstoryImg}
            handleDeleteImage={handleDeleteImage}
          />

          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor="" className="input-label">
              STORY
            </label>
            <textarea
              type="text"
              className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
              placeholder="Your Story"
              rows={10}
              value={story}
              onChange={(e) => setStory(e.target.value)}
            ></textarea>
          </div>
          <div className="pt-3">
            <label className="input-label">VISITED LOCATIONS</label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
