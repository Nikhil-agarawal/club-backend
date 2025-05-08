const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin'); // Your middleware
const jwt = require('jsonwebtoken');

let todos = []; // In-memory storage (for now)

// ✅ Route to get all todos (admin/member both)
router.get('/', (req, res) => {
  res.json(todos);
});

// ✅ Route to add todo (admin only)
router.post('/', isAdmin, (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, message: "Text required" });
  }
  todos.push({ text, isCompleted: false });
  res.status(201).json({ success: true, message: "Todo added successfully" });
});

module.exports = router;
