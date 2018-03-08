const mongoose = require('mongoose');

const db = require('./../config/db');

const paidSchema = new mongoose.Schema({
	date: { type: Date, default: Date.now},
	student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
	value: { type: Number },
	type: {type: String, enum: ['income', 'outcome']},
});

module.exports = db.model('Paid', paidSchema);
