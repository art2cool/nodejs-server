const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const db = require('./../config/db');
//User schema

let UserSchema = new mongoose.Schema({
	name: { type: String, trim: true },
	email: { type: String, require: true, lowercase: true, trim: true, unique: true },
	password: { type: String, require: true },
	role: { type: String },
	phone: { type: String },
	profileimage: {
		type: String
	}
});

let User = module.exports = db.model('User', UserSchema);

module.exports.comparePassword = (candidatePassword, hash, callback) => {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if (err) return callback(err);
		callback(null, isMatch);
	});
}