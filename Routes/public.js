const express = require("express");
const router = express.Router();

const GolfCourse = require("../Modals/GolfCourse");
const { getCourseHoles } = require("../Controllers/course/holeController");

// Public: list all golf courses (no auth)
router.get("/courses", async (req, res) => {
  try {
    const courses = await GolfCourse.find();
    res.status(200).json({ status: true, courses });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error" });
  }
});

// Public: get a single course by id (no auth)
router.get("/course/:id", async (req, res) => {
  try {
    const course = await GolfCourse.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ status: false, message: "Course not found" });
    }
    res.status(200).json({ status: true, course });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error" });
  }
});

// Public: get holes for a course (no auth)
router.get("/holes/:courseId", getCourseHoles);

module.exports = router;


