const mongoose = require('mongoose');

const db = require('./../config/db');

const classSchema = new mongoose.Schema({
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  language: {
    type: String,
    enum: [
      "English",
      "Polish",
      "German",
      "Japanese",
      "Chinese",
      "Spanish",
      "Italian",
      "Turkish",
      "French",
      "Chezh",
      "Arabian"
    ]
  },
  level: {
    type: String,
    enum: [
      "Beginner",
      "Elementary",
      "Pre-intermediate",
      "Intermediate",
      "Upper-intermediate",
      "Advanced"
    ]
  },
  notes: { type: String, trim: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ["induvidual", "semi-induvidual", "group"] },
  createAt: { type: Date, default: Date.now }
});

module.exports = db.model('Class', classSchema);
