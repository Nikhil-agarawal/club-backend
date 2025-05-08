const express = require("express");
const router = express.Router();

// Import admin check middleware
const isAdmin = require("../middleware/isAdmin"); // ✅ path adjust kr lena

// Import Cloudinary upload config
const upload = require("../utils/upload"); // ✅ yeh tera upload.js hai

// Import event controller
const eventController = require("../controllers/eventController"); // ✅ path adjust kr lena

// Route to create a new event
router.post(
  "/create-event",
  isAdmin,                    // ✅ middleware to verify admin
  upload.single("poster"),    // ✅ Cloudinary middleware for single file
  eventController.createEvent // ✅ actual controller function
);

router.get("/all-events", eventController.getAllEvents);

router.delete('/delete-event/:id', eventController.deleteEvent);

router.post('/:eventId/register', eventController.registerForEvent);

// Admin Excel download
router.get('/:eventId/download', eventController.downloadExcel);


module.exports = router;
