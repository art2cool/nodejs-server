const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin } = require('./../middlwares/auth');

const Student = require('../models/students');
/* GET home page. */
router.get('/add', isAuthorized, async (req, res, next) => {
	res.render('student-add', {
		'title': 'Create student'
	});
});

router.get('/', isAuthorized, function(req, res, next) {
	Student
		.find({})
		.sort({name: 1})
		.then( students => {
		//	console.log(students)
			res.render('students', { title: 'Students', students});
		})
		.catch(err => {
			next(err)
		})
})

router.get('/:id', isAuthorized, function(req, res, next) {
	const id = req.params.id;
	console.log(id)
	Student
		.findById(id)
		.then( student => {
		//	console.log(students)
			res.render('student', { title: student.name, student});
		})
		.catch(err => {
			next(err)
		})
});

router.post('/', isAdmin, (req, res) => {
	console.log(req.body)
	const { name, email, phone, language, level, dayofbirth, account, notes} = req.body;
	const student = new Student({
		name, email, phone, language, level, dayofbirth, account, notes
	});
	student
		.save()
		.then( student => {
			res.redirect(`/students/${student._id}`);
		})
})
module.exports = router;
