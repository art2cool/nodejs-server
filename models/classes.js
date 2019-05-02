const mongoose = require('mongoose');

const db = require('./../config/db');
const {languages, levels} = require('./../config/constants');

const classSchema = new mongoose.Schema({
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  language: {
    type: String,
    enum: languages
  },
  level: {
    type: String,
    enum: levels
  },
  coefficient: { type: Number },
  notes: { type: String, trim: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ["induvidual", "semi-induvidual", "group"] },
  createAt: { type: Date, default: Date.now }
});

module.exports = db.model('Class', classSchema);
