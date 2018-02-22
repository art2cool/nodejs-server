var express = require('express');
var router = express.Router();
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
	res.render('register', {
		'title': 'Register'
	});
});

router.get('/login', function(req, res, next) {
	res.render('login', {
		'title': 'Login'
	});
});

router.post('/register', multer({ dest: './uploads/'}).single('upl'), function(req, res, next) {
	//get Form Value
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Check for Image field
	if(req.file) {
		console.log('uploading file...');

		var profileImageOriginalName = req.file.originalname;
		var profileImageName 		 = req.file.name;
		var profileImageMine 		 = req.file.mimetype;
		var profileImagePath 		 = req.file.path;
		var profileImageExt 		 = req.file.extension;
		var profileImageSize 		 = req.file.size;
	} else {
		// set default img
		var profileImageName = 'noimage.jpg';
	}
		// form validator
		req.checkBody('name', 'Name field is required').notEmpty();
		req.checkBody('email', 'Email field is required').notEmpty();
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('password',  'Password field is required').notEmpty();
		req.checkBody('password2','Passwords do not match').equals(req.body.password);

		var errors = req.validationErrors();

		if (errors) {
			res.render('register',{
				errors: errors,
				name: name,
				email: email,
				password: password,
				password2: password2
			});
		} else {
			var newUser = new User({
				name: name,
				email: email,
				password: password,
				profileimage: profileImageOriginalName
			});
			// Creqte User
			User.createUser(newUser, function(err, user){
				if(err) throw err;
				console.log(user);
			});
			//send message
			req.flash('success', 'You are now refistered and may log in');

			res.location('/');
			res.redirect('/');
		}

});


passport.serializeUser(function(user, done) {
  	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
  	});
});

passport.use(new LocalStrategy({
	usernameField: 'email'
},
	function(username, password, done){
		console.log(username, password)
		User.getUserByEmail(username, function(err, user){
			if(err) throw err;
			if(!user){
				console.log('Unknown user');
				return done(null, false, {message: 'Unknown User'});
			}
			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch) {
					return done(null, user);
				} else {
					console.log('invalid password');
					return done(null, false, {message: 'Invalod password'})
				}
			})
		});
	}

));


router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}), function(req, res) {
	console.log('Autentication Succesful');
	req.flash('success', 'You are logged in');
	res.redirect('/');

});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You have logged out');
	res.redirect('/users/login');
});

module.exports = router;


















