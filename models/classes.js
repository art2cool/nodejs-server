const mongoose = require('mongoose');

const db = require('./../config/db');

const classSchema = new mongoose.Schema({
	name: { type: String, trim: true },
	students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
	teacher: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	language: {
		type: String,
		enum: ['English', 'Polish', 'German', 'Japanese']
	},
	level: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
	notes: { type: String, trim: true },
	price: { type: Number },
	type: { type: String, enum: ['induvidual', 'semi-induvidual', 'group'] }
});

module.exports = db.model('Class', classSchema);
