const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin, isManager } = require('./../middlwares/auth');

const Student = require('../models/students');
const Paid = require('../models/paid');
/* GET home page. */
router.get('/add', isAuthorized, (req, res, next) => {
	res.render('student-add', {
		'title': 'Create student'
	});
});

router.get('/', isAuthorized, function(req, res, next) {
	Student
		.find({})
		.sort({name: 1})
		.then( students => {
			res.render('students', { title: 'Students', students});
		})
		.catch(err => {
			next(err)
		})
})

router.get('/:id', isAuthorized, async function(req, res, next) {
	const id = req.params.id;
	try {
		const student = await Student.findById(id);
		const paids = await Paid.find({ student: id }).sort({ date: -1 });
		res.render('student', { title: student.name, student, paids});
	} catch (e) {
		next(e)
	}
});

router.post('/', isAdmin, (req, res) => {
	const { name, email, phone, language, level, dayofbirth, account, notes} = req.body;
	const student = new Student({
		name, email, phone, language, level, dayofbirth, account, notes
	});
	student
		.save()
		.then( student => {
			res.redirect(`/students/${student._id}`);
		})
});
router.post('/:id/payment', isManager, async(req, res, next) => {
	const id = req.params.id;
	const value = ~~req.body.value;
	const type = value > 0 ? 'income' : 'outcome';
	try {
		await Paid.create({student: id, type, value});
		const student = await Student.findById(id);
		student.account += value;
		await student.save();
		res.json(student)
	} catch(e) {
		next(e)
	}
})
module.exports = router;
