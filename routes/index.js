const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin } = require('./../middlwares/auth');

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

router.get('/teachers', isAuthorized, function(req, res, next) {
	User
		.find({role: 'teacher'})
		.then(teachers => {
			res.render('teachers', { title: 'Teachers', teachers});
		})
		.catch(err => {
			next(err)
		})
});

router.get('/teachers/:id', isAuthorized, function(req, res, next) {
	const id = req.params.id;
	User
		.findById(id)
		.then(teacher => {
			res.render('teacher', { title: teacher.name, teacher });
		})
		.catch(err => {
			next(err)
		})
});

module.exports = router;
