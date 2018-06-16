const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin, isManager } = require('./../middlwares/auth');

const Class = require('../models/classes');
const User = require('../models/user');
const Student = require('../models/students');
const Collaboration = require('../models/collaboration');
/* GET home page. */
router.get('/add', isManager, async (req, res, next) => {
	const teachers = await User.find({ role: 'teacher' }).select('name');
	const students = await Student.find({}).select('name');

	res.render('class-add', {
		title: 'Create new class',
		teachers,
		students
	});
});

router.get('/', isAuthorized, function (req, res, next) {
	Class
		.find({})
		.populate({ path: 'teacher', select: 'name' })
		.populate({ path: 'students', select: 'name' })
		.then(classes => {
			res.render('classes', { title: 'Classes', classes });
		})
		.catch(err => {
			next(err)
		})
})

router.get('/:id/lessons/add', (req, res) => {
	const id = req.params.id;

	res.render('collaboration-add', { title: `Create lessons`, clas: id });
})

router.get('/:id/lessons/:collaborationID/edit', async (req, res) => {
	const coll = req.params.collaborationID;

	const collaboration = await Collaboration.findById(coll)
	res.render('collaboration-edit', { title: `Edit lessons`, collaboration });
})

router.get('/:id/lessons/:collaboration', isAuthorized, async function (req, res, next) {
	const id = req.params.id;
	const collaboration = req.params.collaboration;
	Collaboration
		.findById(collaboration)
		.populate({ path: 'class', select: 'students', populate: { path: 'students', select: 'name' } })
		.lean()
		.then(collaboration => {
			console.log(collaboration)
			res.render('lesson', { title: `Lessons`, collaboration });
		})
		.catch(e => {
			next(e);
		})
});

router.get('/:id', isAuthorized, async function (req, res, next) {
	const id = req.params.id;
	try {
		const clas = await Class
			.findById(id)
			.populate({ path: 'students', select: 'name' })
			.populate({ path: 'teacher', select: 'name' })
			.lean()
			.exec();

		clas.collaborations = await Collaboration
			.find({ class: id })
			.exec();

		res.render('class', { title: `${clas.language} ${clas.level} (${clas.teacher.name})`, clas });
	} catch (e) {
		next(e);
	}
});

router.post('/', isAdmin, async (req, res) => {
	const { teacher, students, language, price, level, type, notes } = req.body;
	const clas = await Class.create({ teacher, students, language, price, level, type, notes })

	res.redirect(`/classes/${clas._id}`)
})
module.exports = router;
