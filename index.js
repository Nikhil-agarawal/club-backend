const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require("cors");
const User = require('./models/studentSchema')
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true // if you're using cookies or sessions
}));
app.use(express.json());

const bcrypt = require("bcryptjs");
const adminCheck = require('./middleware/Admincheck')
const memberCheck=require('./middleware/membermiddleware')
const tokenCheck = require('./middleware/middleware')
const attendance = require('./models/attendenceSchema')
const admin = require('./models/adminSchema')
const noti=require('./models/notischema')
const Team=require('./models/teamschema')
const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketIo(server);
const Calendar = require('./models/calendarschema');
app.use(express.urlencoded({ extended: false }));
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const verifyToken=require("./middleware/verifyToken")
const database = require("./config/database");
require("dotenv").config();


const authRoutes=require('./routes/authRoutes')
const eventRoutes = require("./routes/eventRoutes");
const memberRoutes=require('./routes/memberRoutes')  


//server running status 
database.connect();

const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET;
// const todoRoutes = require('./routes/todoRoutes');


app.use((req, res, next) => {
  // console.log(req.headers);
  next();
});


  app.use('/api/auth', authRoutes);

  app.use("/api/event", eventRoutes);
  
  app.use("/api/members",memberRoutes);
  // app.use('/api/todos', todoRoutes);






  app.listen(PORT,()=>{
    console.log(`App is running ar ${PORT}`);
  })


// attendence endpoints
// Routes for attendance management

// Get all users (students)
app.get('/getuser', async (req, res) => {
try {
  const attendances = await User.find({}, { _id: 0, name: 1, status: 1 });
  res.send({ status: "ok", data: attendances });
} catch (err) {
  console.error(err);
  res.status(500).send('Error retrieving attendance data');
}
});

// Submit attendance for a specific date
app.post("/submit-attendence", verifyToken, adminCheck, async (req, res) => {

try {
  const attendanceData = req.body.attendanceData;

  const date = new Date(req.body.date);

  // Check if attendance already exists for this date
  const existingAttendance = await attendance.findOne({ date: date });

  if (existingAttendance) {
    // Update existing attendance record
    existingAttendance.attendanceData = attendanceData.map(({ name, status }) => ({
      name,
      status
    }));
    await existingAttendance.save();
  } else {
    // Create new attendance record
    const attendanceReport = new attendance({
      attendanceData: attendanceData.map(({ name, status }) => ({
        name,
        status
      })),
      date: date
    });
    await attendanceReport.save();
  }

  res.status(200).json({ message: 'Attendance data saved successfully' });
} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Error saving attendance data' });
}
});

// Get attendance for a specific date
app.post('/getattendancebydate',verifyToken, adminCheck, async (req, res) => {
try {    
  const requestedDate = new Date(req.body.date);
  
  console.log("Requested Date: ", requestedDate);
 

  // Find attendance for that date with error handling
  const attendanceRecord = await attendance.findOne({ 
    date: {
      $gte: new Date(requestedDate.setHours(0, 0, 0)),
      $lt: new Date(requestedDate.setHours(23, 59, 59))
    }
  });
  console.log("Found Attendance Record: ", attendanceRecord);
  if (!attendanceRecord) {
    return res.status(404).json({ 
      status: "error", 
      message: 'Attendance data not found for the requested date'
    });
  }

  const data = attendanceRecord.attendanceData.map(ad => ({
    name: ad.name,
    status: ad.status
  }));

  res.send({ status: "ok", data: data });
} catch (err) {
  console.error(err);
  res.status(500).json({ 
    status: "error", 
    message: 'Error retrieving attendance data'
  });
}
});

// Get all attendance dates (for listing available dates)
app.get('/getattendancedates', verifyToken, adminCheck, async (req, res) => {
try {
  const dates = await attendance.find({}, { date: 1, _id: 0 })
    .sort({ date: -1 }); // Sort by date descending (newest first)
  
  res.send({ 
    status: "ok", 
    data: dates.map(item => item.date)
  });
} catch (err) {
  console.error(err);
  res.status(500).json({ 
    status: "error", 
    message: 'Error retrieving attendance dates'
  });
}
});

//notifcation management

app.post('/notify-all', async (req, res) => {
  try {
    // Get the title and message from the request body
    const { title, content } = req.body;
    
    // Create a new notification with the title and message
    const notification = new noti({
      title,
      content,
    });
    
    // Save the notification to the database
    await notification.save();
    
    // Send the notification to all students using Socket.IO
    io.emit('notification', notification);
    
    // Send a response indicating success
    res.status(200).send('Notification sent to all students!');
  } catch (err) {
    // Send a response indicating failure
    console.error(err);
    res.status(500).send('Failed to send notification.');
  }
  let notificationReceived = false;

io.on('notification', (data) => {
  if (!notificationReceived) {
    // handle the notification
    notificationReceived = true;
  }
});

});

// Get notifications for a student
app.get('/api/notifications',tokenCheck, async (req, res) => {
  try {
    const notifications = await noti.find({},{_id:0, createdAt:0});

    res.send(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting notifications');
  }
});

//team management  routes

//--->1:add teams route
app.post('/addteams', adminCheck, async (req, res) => {
  const { teamNumber, studentNames } = req.body;
  const newTeam = new Team({
    teamNumber,
    studentNames: studentNames.map(name => ({ name }))
  });

  await newTeam
    .save()
    .then(() => {
      res.status(201).json({ message: 'Team added successfully.' });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

//--->2: update routes





//student routes







app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});



app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    User.deleteOne({ _id: userid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});






//calender routes



app.post("/calendarschema", async (req, res) => {
  try {
    const { title, start, end } = req.body;
    const newCalendarEvent = await Calendar.create({ title, start, end });
    return res.status(201).json(newCalendarEvent);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

// Get all calendar events
app.get("/calendarschema", async (req, res) => {
  try {
    const calendarEvents = await Calendar.find();
    return res.status(200).json(calendarEvents);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

// Update an existing calendar event
app.put("/calendarschema/:id", async (req, res) => {
  try {
    const { title, start, end } = req.body;
    const updatedEvent = await Calendar.findByIdAndUpdate(
      req.params.id,
      { title, start, end },
      { new: true }
    );
    if (!updatedEvent) return res.status(404).send("Event not found");
    return res.status(200).json(updatedEvent);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

// Delete a calendar event
app.delete("/calendarschema/:id", async (req, res) => {
  try {
    const deletedEvent = await Calendar.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).send("Event not found");
    return res.status(200).send("Event deleted successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

//team routes
/* 1-->new 
2-->edit 
3-->delete*/

//newTeam create route

app.post('/addteam',adminCheck,async(req,res)=>{
  try{
  const {teamNumber,studentNames}=req.body
  const newTeam = await Team.create({
  teamNumber,studentNames
  });
  return res.status(201).json(newTeam);
}catch (err) {
  console.error(err);
  return res.status(500).send("error");
}
});


//get team details when user is choosed


app.post('/getteams', async (req, res) => {
  try {
    const teamNo = parseInt(req.body.teamNo);

    const teams = await Team.find({ teamNumber: teamNo });
  

    if (!teams || teams.length === 0) {
      return res.status(404).json({ error: 'No teams found' });
    }

    const studentNames = teams.map(team => {
      return team.studentNames.map(student => {
        return { name: student.name };
      });
    }).flat();

    return res.status(200).json({ studentNames });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error');
  }
});




//edit route

app.put('/editteam', adminCheck, async (req, res) => {
  try {
    const { teamNumber, studentNames } = req.body;
    const updatedTeam = await Team.findOneAndUpdate(
      { teamNumber: teamNumber },
      { studentNames: studentNames },
      { new: true }
    );
    if (!updatedTeam) {
      return res.status(404).send('Team not found');
    }
    return res.status(200).json(updatedTeam);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error updating team');
  }
});


//delete overall team
app.delete('/deleteteam', adminCheck, async (req, res) => {
  try {
    const { teamNumber } = req.body;
    const deletedTeam = await Team.findOneAndDelete({ teamNumber: teamNumber });
    if (!deletedTeam) {
      return res.status(404).send("Team not found");
    }
    return res.status(200).json(deletedTeam);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error deleting team");
  }
});






