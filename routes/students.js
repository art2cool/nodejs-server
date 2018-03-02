const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin } = require('./../middlwares/auth');

const Students = require('../models/students');
/* GET home page. */
router.get('/add', isAuthorized, async (req, res, next) => {

	res.render('student-add', {
		'title': 'Create student'
	});
});

router.get('/', isAuthorized, function(req, res, next) {
	Students
		.find({})
		.sort({name: 1})
		.then( students => {
		//	console.log(students)
			res.render('students', { title: 'Students', students});
		})
		.catch(err => {
			next(err)
		})
});

module.exports = router;
