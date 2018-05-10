
const bcrypt = require('bcrypt')
const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin, isManager } = require('./../middlwares/auth');

const User = require('../models/user');
/* GET home page. */
router.get('/', isAuthorized, function(req, res, next) {
	User
		.find({})
		.then( users => {
			res.render('index', { title: 'Members', users});
		})
		.catch(err => {
			next(err)
		})
});

router.get('/teachers/add', isAuthorized, (req, res, next) => {
	res.render('teacher-add', {
		'title': 'Create teachers'
	});
});

router.post('/teachers', isAdmin, (req, res, next) => {
	const { email, name, phone, coeficient, password } = req.body;

	bcrypt.hash(password, 10, (err, hash) => {
		if (err) throw err;
		const teacher = new User({
			email,
			name,
			phone,
			coeficient,
			role: 'teacher',
			password: hash
		});
		teacher
			.save()
			.then(teacher => {
				res.redirect(`/teachers/${teacher._id}`);
			})
			.catch(err => {
				next(err);
			})
	});

})

router.get('/teachers', isManager, function(req, res, next) {
	User
		.find({role: 'teacher'})
		.then(teachers => {
			res.render('teachers', { title: 'Teachers', teachers});
		})
		.catch(err => {
			next(err)
		})
});

router.get('/teachers/:id', isManager, function(req, res, next) {
	const id = req.params.id;
	User
		.findById(id)
		.select('-password')
		.then(teacher => {
			res.render('teacher', { title: teacher.name, teacher });
		})
		.catch(err => {
			next(err)
		})
});

module.exports = router;
