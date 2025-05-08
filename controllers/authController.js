const User = require('../models/studentSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const admin = require('../models/adminSchema'); 

const Mail=process.env.MAIL_USER;
const Password=process.env.MAIL_PASS;
//const jwt = require("jsonwebtoken");


const JWT_SECRET = process.env.JWT_SECRET;

//admin register
exports.register = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 1. Check if admin already exists
      const existingAdmin = await admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin already exists" });
      }
  
      // 2. Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 3. Create new admin
      const newAdmin = new admin({
        email,
        password: hashedPassword,
      });
  
      // 4. Save to MongoDB
      await newAdmin.save();
  
      // 5. Send success + token if you want
      const token = jwt.sign({ id: newAdmin._id, role: "admin" }, JWT_SECRET, {
        expiresIn: "24hr",
      });
  
      res.status(201).json({ message: "Admin registered successfully", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  };


//admin login 
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: 'admin' }, JWT_SECRET, {
      expiresIn: "24hr"
    });

    res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Similarly, add userData, forgotPassword, getResetPassword, postResetPassword
// User Registration



//user register(member)
exports.userRegister = async (req, res) => {
  const { name, rollNo, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      rollNo,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// User Login(member)
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
      
      expiresIn: "24hr"
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};




exports.userData = async (req, res) => {
    const { token } = req.body;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const useremail = decoded.email;
  
      const user = await User.findOne({ email: useremail });
  
      if (!user) {
        return res.send({ status: "error", data: "User not found" });
      }
  
      res.send({ status: "ok", data: user });
    } catch (error) {
      console.error("Token error:", error);
      res.send({ status: "error", data: "Invalid or expired token" });
    }
  };
  

  exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Pehle User collection check karo
      let user = await User.findOne({ email });
      let role = "user";
  
      // Agar user nahi mila, admin collection check karo
      if (!user) {
        user = await admin.findOne({ email });
        role = "admin";
      }
  
      // Dono me se koi bhi na mile to error bhejo
      if (!user) {
        return res.status(404).json({ status: "User Not Found" });
      }
  
      // Secret create karo: JWT_SECRET + hashed password
      const secret = JWT_SECRET + user.password;
      const token = jwt.sign({ email: user.email, id: user._id, role }, secret, {
        expiresIn: "1h",
      });
  
      // Link banao reset ke liye
      const link = `http://localhost:3001/resetPassword/${user._id}/${token}`;
  
      // Mail bhejne ka transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: Mail,
          pass: Password,
        },
      });
  
      const mailOptions = {
        from: "your_email@gmail.com",
        to: email,
        subject: "Password Reset Link",
        text: `Click the link to reset your password: ${link}`,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Failed to send email" });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).json({ message: "Reset link sent successfully" });
        }
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

  // Reset password handler
exports.resetPassword = async (req, res) => {
    const { userId, token, newPassword } = req.body;
  
    let user = await User.findById(userId);
    if (!user) {
      user = await admin.findById(userId); // Try in Admin model if not found in User
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    }
  
    const secret = JWT_SECRET + user.password;
  
    try {
      jwt.verify(token, secret);
      const encrypted = await bcrypt.hash(newPassword, 10);
      user.password = encrypted;
      await user.save();
      return res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ success: false, message: "invalid signature" });
    }
  };
  