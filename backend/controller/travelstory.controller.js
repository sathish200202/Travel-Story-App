const TravelStory = require("../models/travelstory.module");
const fs = require("fs");
const path = require("path");
const { authenticateToken } = require("../utilities");
//ADD STORY
const AddTravellStory = async (req, res) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  //Validate required fields
  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are requierd" });
  }

  //convsrt visistedDate from millisecods to Date object
  const parseVisitedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = await new TravelStory({
      userId,
      title,
      story,
      visitedLocation,
      imageUrl,
      visitedDate: parseVisitedDate,
    });
    await travelStory.save();

    res.status(200).json({
      userId: userId,
      story: travelStory,
      message: "Story Added successfully",
    });
  } catch (error) {
    console.log("Error add story controller ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//GET ALL STORY
const GetAllStory = async (req, res) => {
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.find({ userId: userId }).sort({
      isFavourite: -1,
    });
    res.status(200).json({
      error: false,
      stories: travelStory,
    });
  } catch (error) {
    console.log("Error in getallstory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//handle image upload
const ImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image upload" });
    }

    const imageUrl = `https://travel-story-app-backend-eitd.onrender.com/uploads/${req.file.filename}`;
    res.status(201).json({ imageUrl });
  } catch (error) {
    console.log("Error in upload image controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//DELETE IMAGE
const DeleteImage = async (req, res) => {
  const { imageUrl } = req.query;
  //console.log("imageUrl :", imageUrl);

  if (!imageUrl) {
    return res.status(400).json({ message: "imageUrl parameter is required" });
  }

  try {
    //Extract the filename from the imageUrl
    const filename = path.basename(imageUrl);
    //console.log("filename :", filename);

    //Define the file path
    const filePath = path.join("uploads", filename);
    //console.log(" filePath:", filePath);
    //Check if the file exists
    if (fs.existsSync(filePath)) {
      //Delet the file from the uploads folder
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.status(200).json({ message: "Image not found" });
    }
  } catch (error) {
    console.log("Error in delete image controller", error.message);
    res.status(500).json({ error: error.message, message: "Server error" });
  }
};

//UPDATE TRAVEL STORY
const UpdateStory = async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;
  if (!title || !story || !visitedLocation || !visitedDate) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are requierd" });
  }

  //convsrt visistedDate from millisecods to Date object
  const parseVisitedDate = new Date(parseInt(visitedDate));

  try {
    //find the travel story bg ID and ensure it belongs to the aunthencticated user
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      return res.status(404).json({ message: "Travel story not found" });
    }

    const placehoderImageUrl = "";
    (travelStory.title = title),
      (travelStory.story = story),
      (travelStory.visitedLocation = visitedLocation),
      (travelStory.imageUrl = imageUrl || placehoderImageUrl),
      (travelStory.visitedDate = parseVisitedDate);

    await travelStory.save();
    res
      .status(200)
      .json({ story: travelStory, message: "Updated successfully" });
  } catch (error) {
    console.log("Error in update ttavel story controller ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//DELETE TRAVEL STORY
const DeleteStory = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  try {
    const travelStory = await TravelStory.findOne({
      _id: id,
      userId: userId,
    });
    if (!travelStory) {
      return res.status(404).json({ message: "Travel Story not found" });
    }
    await travelStory.deleteOne({ _id: id, userId: userId });

    //Extract the travel story from the imageUrl
    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);

    //define the file path
    const filePath = path.join("uploads", filename);

    //delete the image file from the uploads folder
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("Failed to delete image file: ", err);
      }
    });
    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.log("Error in delete travel story controller ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Update isFavourite
const UpdateisFavourite = async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      return res
        .status(200)
        .json({ message: "Travel Story not found", error: true });
    }
    travelStory.isFavourite = isFavourite;

    await travelStory.save();
    res
      .status(200)
      .json({ story: travelStory, message: "Update successfully" });
  } catch (error) {
    console.log("Error in isFavourite controller ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Search travel story
const SearchStory = async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if (!query) {
    return res.status(404).json({ error: true, message: "query is required" });
  }
  try {
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });

    res.status(200).json({ stories: searchResults });
  } catch (error) {
    console.log("Error in Search controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Filter travel stories by date range
const FilterByDate = async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  try {
    //convert startDate and endDate from milliseconds to Date objects
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start Date and End date are required" });
    }

    //find travel stories that belong to the authenticated user and fall within the date range
    const fillteredStories = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavourite: -1 });

    res.status(200).json({ stories: fillteredStories });
  } catch (error) {
    console.log("Error in filter by date controller ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  AddTravellStory,
  GetAllStory,
  ImageUpload,
  DeleteImage,
  UpdateStory,
  DeleteStory,
  UpdateisFavourite,
  SearchStory,
  FilterByDate,
};
