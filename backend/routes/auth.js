const express = require('express');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { role, password, ...rest } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (role === 'student') {
      const { fullName, registerNumber, department, batch } = rest;
      
      const existingStudent = await Student.findOne({ registerNumber });
      if (existingStudent) {
        return res.status(400).json({ message: "Student with this Register Number already exists" });
      }

      const newStudent = new Student({
        fullName,
        registerNumber,
        department,
        batch,
        password: hashedPassword,
      });

      const savedStudent = await newStudent.save();
      return res.status(201).json({ message: "Student registered successfully", user: { id: savedStudent._id, registerNumber: savedStudent.registerNumber } });
    
    } else if (role === 'admin') {
      const { fullName, email } = rest;

      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin with this Email already exists" });
      }

      const newAdmin = new Admin({
        fullName,
        email,
        password: hashedPassword,
      });

      const savedAdmin = await newAdmin.save();
      return res.status(201).json({ message: "Admin registered successfully", user: { id: savedAdmin._id, email: savedAdmin.email } });
    
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { role, password, registerNumber, email } = req.body;

  try {
    if (role === 'student') {
      const student = await Student.findOne({ registerNumber });
      if (!student) {
        return res.status(400).json({ message: "Invalid Register Number or Password" });
      }

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Register Number or Password" });
      }

      return res.status(200).json({ 
        message: "Login successful", 
        user: { 
          id: student._id, 
          registerNumber: student.registerNumber, 
          fullName: student.fullName,
          department: student.department,
          batch: student.batch
        } 
      });

    } else if (role === 'admin') {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ message: "Invalid Email or Password" });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Email or Password" });
      }

      return res.status(200).json({ message: "Login successful", user: { id: admin._id, email: admin.email, fullName: admin.fullName } });

    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
});

module.exports = router;
