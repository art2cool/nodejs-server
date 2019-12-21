const mongoose = require('mongoose');

const db = require('./../config/db');
const { languages, levels } = require("./../config/constants");
//User schema

const studentSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true
  },
  phone: { type: String, trim: true },
  language: {
    type: String,
    enum: languages
  },
  level: {
    type: String,
    enum: levels
  },
  notes: { type: String, trim: true },
  dayOfBirth: {
    type: Date
  },
  account: { type: Number },
  createAt: { type: Date, default: Date.now }
});

module.exports = db.model('Student', studentSchema);
