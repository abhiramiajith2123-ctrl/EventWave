const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Nammal ippo undakkiya Event model import cheyyunnu
const Event = require('./models/Event'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB is connected successfully! 🎉'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Puthiya Event Save Cheyyanulla Route (POST Request)
app.post('/api/events', async (req, res) => {
  try {
    const newEvent = new Event(req.body); // Frontend-il ninnu varunna data edukkunnu
    const savedEvent = await newEvent.save(); // Database-lekku save cheyyunnu
    res.status(201).json(savedEvent); // Save aayathu frontend-lekku thirichu ayakkunnu
  } catch (error) {
    res.status(500).json({ message: "Event save cheyyan pattiyailla", error });
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