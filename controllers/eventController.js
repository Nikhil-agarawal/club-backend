const Event = require('../models/eventSchema');  // Import the Event model (do not redefine it)
const ExcelJS = require('exceljs');

// Create event
exports.createEvent = async (req, res) => {
 

  try {
    const { title, endTime } = req.body;

    // Check if required fields are provided
    if (!req.file || !title || !endTime) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const posterUrl = req.file.path;
    console.log(posterUrl);
    // Create new event and save to MongoDB
    const newEvent = new Event({
      title,
      endTime,
      posterUrl, // Cloudinary URL
    });

    // Save event to the database
    await newEvent.save();  // Save the event instance

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: {
        title,
        endTime,
        poster: posterUrl,
      },
    });
  } catch (err) {
    console.error("Error creating event:", err); // Log the error if something goes wrong
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Fetch all events (controller)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }); // Sort by createdAt, latest first
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, email, phone } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (new Date() > event.endTime) {
      return res.status(400).json({ message: "Event registration closed" });
    }

    event.registrations.push({ name, email, phone });
    await event.save();

    res.status(200).json({ message: "Registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// 📌 Download Registrations as Excel (Admin Only)
exports.downloadExcel = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registrations');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Registered At', key: 'timestamp', width: 25 },
    ];

    // 👇 Only picking necessary fields
    worksheet.addRows(
      event.registrations.map(reg => ({
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        timestamp: reg.timestamp,
      }))
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=registrations-${event.title}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Excel download failed" });
  }
};



exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting event" });
  }
};
