const mongoose = require('mongoose');

const db = require('./../config/db');

const collaborationSchema = new mongoose.Schema({
	class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
	status: {type: String, enum: ['planned', 'review', 'finished']},
	until: { type: Date },
	since: { type: Date },
	createAt: { type: Date, default: Date.now },
	room: {type: String},
	students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

module.exports = db.model('Collaboration', collaborationSchema);
