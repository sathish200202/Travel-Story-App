const express = require("express");
const {
  AddTravellStory,
  GetAllStory,
  ImageUpload,
  DeleteImage,
  UpdateStory,
  DeleteStory,
  UpdateisFavourite,
  SearchStory,
  FilterByDate,
} = require("../controller/travelstory.controller");
const { authenticateToken } = require("../utilities");
const upload = require("../multer");

const router = express.Router();

//STORY
router.post("/add-travel-story", authenticateToken, AddTravellStory);
router.get("/", authenticateToken, GetAllStory);
router.put("/update-story/:id", authenticateToken, UpdateStory);
router.delete("/delete-story/:id", authenticateToken, DeleteStory);

//IMAGES
router.post("/image-upload", upload.single("image"), ImageUpload);
router.delete("/delete-image", DeleteImage);

//ISFAVOURITE
router.put("/update-is-favoruite/:id", authenticateToken, UpdateisFavourite);

//SEARCH STORY
router.get("/search", authenticateToken, SearchStory);

//FILTER BY DATE RANGE
router.get("/filterby-date-range", authenticateToken, FilterByDate);

module.exports = router;
