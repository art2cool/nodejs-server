var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
//User schema

var UserSchema = mongoose.Schema({
	password: {
		type: String,
		bcrypt: true,
		required: true
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	profileimage: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) return callback(err);
		callback(null, isMatch);
	});
}


module.exports.getUserById = function(id, callback) {

	User.findById(id, callback);
}

module.exports.getUserByEmail = function(email, callback) {
	var query = {email: email};
	User.findOne(query, callback);
}

module.exports.getAllUsers = function(callback) {
	User.find({}, callback);
}

module.exports.createUser = function(newUser, callback) {
	bcrypt.hash(newUser.password, 10, function(err, hash) {
		if (err) throw err;

		newUser.password = hash;
		//Creqte User
		newUser.save(callback);
	});

}