const mongoose = require('mongoose');

const db = require('./../config/db');
//User schema

const studentSchema = new mongoose.Schema({
	name: { type: String, trim: true },
	email: { type: String, require: true, lowercase: true, trim: true, unique: true },
	phone: { type: String, trim: true },
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
		type: String, enum: [
			"Beginner",
			"Elementary",
			"Pre-intermediate",
			"Intermediate",
			"Upper-intermediate",
			"Advanced"
		] },
	notes: { type: String, trim: true },
	dayOfBirth: {
		type: Date
	},
	account: { type: Number },
	createAt: { type: Date, default: Date.now}
});

module.exports = db.model('Student', studentSchema);
