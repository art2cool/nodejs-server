const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin } = require('./../middlwares/auth');

const Class = require('../models/classes');
/* GET home page. */
router.get('/add', isAuthorized, async (req, res, next) => {
	res.render('student-add', {
		'title': 'Create student'
	});
});

router.get('/', isAuthorized, function(req, res, next) {
	Class
		.find({})
		.populate({ path: 'teacher', select: 'name'})
		.populate({path: 'students', select: 'name'})
		.then( classes => {
			res.render('classes', { title: 'Classes', classes});
		})
		.catch(err => {
			next(err)
		})
})

router.get('/:id', isAuthorized, function(req, res, next) {
	const id = req.params.id;
	Class
		.findById(id)
		.populate({ path: 'students', select: 'name' })
		.populate({ path: 'teacher', select: 'name' })
		.then( clas => {
			res.render('class', { title: `${clas.language} ${clas.level} (${clas.teacher.name})`, clas});
		})
		.catch(err => {
			next(err)
		})
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
})
module.exports = router;
