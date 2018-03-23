const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin } = require('./../middlwares/auth');

const Class = require('../models/classes');
const Collaboration = require('../models/collaboration');
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

	router.get('/:id/lessons/:collaboration', isAuthorized, async function (req, res, next) {
		const id = req.params.id;
		const collaboration = req.params.collaboration;
		Collaboration
		.findById(collaboration)
		.populate({ path: 'class', select: 'students', populate: { path: 'students', select: 'name' }})
		.then( collaboration => {
			console.log('-----------clas.collaborations')
			console.log(collaboration)
			res.render('lesson', { title: `Collaborations`, collaboration });
		})
		.catch(e => {
			next(e);
		})
});

router.get('/:id', isAuthorized, async function(req, res, next) {
	const id = req.params.id;
	try {
		const clas = await Class
			.findById(id)
			.populate({ path: 'students', select: 'name' })
			.populate({ path: 'teacher', select: 'name' })
			.lean()
			.exec();

		const coll = await Collaboration
			.find({class: id})
			.exec();

			console.log(coll)
		clas.collaborations = {};
		clas.collaborations.finished = coll.filter(el => el.status === 'finished')
		clas.collaborations.review = coll.filter(el => el.status === 'review')
		clas.collaborations.planned = coll.filter(el => el.status === 'planned')
		res.render('class', { title: `${clas.language} ${clas.level} (${clas.teacher.name})`, clas});
	} catch (e) {
		next(e);
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
})
module.exports = router;
