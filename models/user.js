const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const db = require('./../config/db');
//User schema
const userSchema = new mongoose.Schema({
	name: { type: String, trim: true },
	email: { type: String, require: true, lowercase: true, trim: true, unique: true },
	password: { type: String, require: true },
	role: { type: String, enum: ['admin', 'teacher'] },
	phone: String,
	createAt: { type: Date, default: Date.now }
});

userSchema.methods.toJSON = function () {
	let user = this.toObject();
	delete user.password;

	return user;
};

let User = module.exports = db.model('User', userSchema);

module.exports.comparePassword = (candidatePassword, hash, callback) => {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if (err) return callback(err);
		callback(null, isMatch);
	});
}