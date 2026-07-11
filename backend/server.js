const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Event = require('./models/Event');
const authRoutes = require('./routes/auth'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://campus-event-wave.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB is connected successfully! 🎉'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Auth Routes
app.use('/api/auth', authRoutes);

// 1. Create Event (POST)
app.post('/api/events', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Event save cheyyan pattiyailla", error });
  }
});

// 2. Get All Events (GET)
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().populate('registeredStudents', 'fullName registerNumber department batch email yearOfStudy');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Events edukkan pattiyailla", error });
  }
});

// 3. Update Event (PUT)
app.put('/api/events/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Event update cheyyan pattiyailla", error });
  }
});

// 4. Delete Event (DELETE)
app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event successfully deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Event delete cheyyan pattiyailla", error });
  }
});

// 5. Register for Event
app.post('/api/events/:id/register', async (req, res) => {
  const { studentId } = req.body;
  try {
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.registeredStudents.includes(studentId)) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    event.registeredStudents.push(studentId);
    await event.save();
    
    res.status(200).json({ message: "Successfully registered for the event!" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
});

// Basic Route
app.get('/', (req, res) => {
  res.send('EventWave Backend is running!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});