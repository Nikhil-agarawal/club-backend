const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin"); // Assuming authMiddleware exists for authentication
const Member = require("../models/studentSchema"); // Assuming Member model exists
const bcrypt =require("bcrypt")
// Get all members
router.get("/", isAdmin, async (req, res) => {
  try {
    const members = await Member.find();
    res.json({ members });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch members", error: err.message });
  }
});

// Create a new member
router.post("/", isAdmin, async (req, res) => {
  const { name, rollNo, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newMember = new Member({ name, rollNo, email, password: hashedPassword,    });
    await newMember.save();
    res.status(201).json({ message: "Member created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create member", error: err.message });
  }
});

// Delete a member
router.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await Member.findByIdAndDelete(id);
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete member", error: err.message });
  }
});

module.exports = router;
