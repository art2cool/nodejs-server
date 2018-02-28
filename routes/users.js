const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

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

router.post('/register', multer({ dest: './uploads/'}).single('upl'), function (req, res, next) {
	const { name, email, password, password2 } = req.body;
	// Check for Image field
	// if(req.file) {
	// 	console.log('uploading file...');

	// 	var profileImageOriginalName = req.file.originalname;
	// 	var profileImageName 		 = req.file.name;
	// 	var profileImageMine 		 = req.file.mimetype;
	// 	var profileImagePath 		 = req.file.path;
	// 	var profileImageExt 		 = req.file.extension;
	// 	var profileImageSize 		 = req.file.size;
	// } else {
	// 	// set default img
	// 	var profileImageName = 'noimage.jpg';
	// }
	
	// form validator
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		return res.render('register', {errors, name, email, password, password2 });
	}

	bcrypt.hash(password, 10, (err, hash) => {
		if (err) throw err;
		const newUser = new User({
			name,
			email,
			password: hash
		});
		newUser
			.save()
			.then(user => {
				req.flash('success', 'You are now refistered and may log in');
			//	res.location('/');
				res.redirect('/');
			})
			.catch(err => next(err))
	});
});


passport.serializeUser(function(user, done) {
  	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
  	});
});

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
	User
		.findOne({ email })
		.then((user) => {
			if (!user) return done(null, false, { message: 'Unknown User' });
			User.comparePassword(password, user.password, (err, isMatch) => {
				if (isMatch) return done(null, user);
				done(null, false, { message: 'Invalod password' })
			})
		})
		.catch(err => done(err))
}));


router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}), (req, res) => {
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


















