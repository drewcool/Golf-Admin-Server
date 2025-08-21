const express = require('express')
const { getAllAdmin , register, login, getin, addClub, addManyClubs, getClubs, getUsersList, deleteClub, updateClub, getOneClub, deleteAdmin, deleteUser, deleteLession, editLession, dashboardData } = require('../Controllers/AdminController')
const protectAdmin = require('../middleWere/authAdminMiddlewere')
const GolfCourse = require('../Modals/GolfCourse')
const { saveCourseHoles, getCourseHoles, deleteCourseHoles } = require('../Controllers/course/holeController')
const { coursesUpload } = require('../middleWere/golfImageMiddlewere')

// multer fields for course image + gallery
const uploadFields = coursesUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
])
const route = express.Router()

route.get('/get' , getAllAdmin)
route.post('/register' , register)
route.post('/login' , login)
route.post('/getin' , protectAdmin , getin)
route.delete('/delete/:id' , protectAdmin , deleteAdmin)

route.delete('/deleteUser/:id' , protectAdmin , deleteUser)

route.delete('/deleteLession/:id' , protectAdmin , deleteLession)
route.put('/editLession/:id' , protectAdmin , editLession)


route.post('/addClub' , protectAdmin , addClub)
route.put('/update-club/:id', updateClub);
route.get('/club/:id', getOneClub);

route.delete("/delete-clubs/:id", protectAdmin , deleteClub)
route.post('/addMeny' , protectAdmin , addManyClubs)
route.get('/get-clubs' , protectAdmin , getClubs)



route.get('/getUsersList' , protectAdmin , getUsersList)

// dashboard summary
route.get('/dashboard-data', protectAdmin, dashboardData)

// ===== RESTful admin endpoints for Golf Courses =====
// Create a course (admin)
route.post('/courses', protectAdmin, uploadFields, async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      latitude,
      longitude,
      description,
      holesCount,
      teeDetails,
      facilities,
      contact,
    } = req.body;

    const requiredFields = ['name', 'address', 'city', 'state', 'description'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ status: false, error: `${field} is required` });
      }
    }

    if (teeDetails && teeDetails.some && teeDetails.some((tee) => !tee.color || !tee.distanceInYards || !tee.manScore || !tee.womanScore)) {
      return res.status(400).json({ message: 'Each tee detail must include color, distanceInYards, manScore, and womanScore' });
    }

    const newCourse = new GolfCourse({
      name,
      address,
      city,
      state,
      latitude,
      longitude,
      image: req.files['image'] ? req.files['image'][0].path : null,
      gallery: req.files['gallery'] ? req.files['gallery'].map((file) => file.path) : [],
      description,
      holesCount,
      teeDetails,
      facilities: facilities ? [facilities] : [],
      contact: contact ? { phone: contact } : {},
      rating: [],
    });

    await newCourse.save();

    return res.status(201).json({
      status: true,
      message: 'Golf course added successfully',
      course: newCourse,
      courseId: newCourse._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: 'Server error' });
  }
});

// List courses
route.get('/courses', protectAdmin, async (req, res) => {
  try {
    const courses = await GolfCourse.find();
    res.status(200).json({ status: true, message: 'Courses fetched', courses });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Server error' });
  }
});

// Get single course
route.get('/courses/:id', protectAdmin, async (req, res) => {
  try {
    const course = await GolfCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ status: false, message: 'Course not found' });
    res.status(200).json({ status: true, message: 'Course fetched', course });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Server error' });
  }
});

// Delete course (alias to keep existing route unaffected)
route.delete('/courses/:id', protectAdmin, async (req, res) => {
  try {
    const course = await GolfCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ status: false, message: 'Golf course not found' });
    await course.deleteOne();
    res.status(200).json({ status: true, message: 'Golf course deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Server error' });
  }
});

// ===== Admin-friendly Hole endpoints (aliases wrapping existing controllers) =====
route.get('/courses/:courseId/holes', protectAdmin, getCourseHoles);
route.post('/courses/:courseId/holes', protectAdmin, (req, res) => {
  req.body.courseId = req.params.courseId;
  return saveCourseHoles(req, res);
});
route.delete('/courses/:courseId/holes', protectAdmin, deleteCourseHoles);

route.get("/getGolfCourses", async (req, res) => {
    try {
      const courses = await GolfCourse.find(); 
      res.status(200).json({ message: "Golf courses retrieved successfully", courses });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });


  route.delete("/delete-GolfCourse/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const course = await GolfCourse.findById(id);
      if (!course) {
          return res.status(404).json({
            status: false,
            message: "Golf course not found"
          });
      }
      await course.deleteOne();
      res.status(200).json({
          status: true,
          message: "Golf course deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Something went wrong while deleting the golf course"
      });
    }
  })




module.exports = route