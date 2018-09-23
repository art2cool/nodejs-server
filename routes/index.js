
const bcrypt = require('bcrypt')
const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin, isManager } = require('./../middlwares/auth');

const User = require('../models/user');
const Collaboration = require('../models/collaboration');
const Class = require('../models/classes');
/* GET home page. */
router.get('/', isAuthorized, async (req, res, next) => {
	try {
		const events = [];
		let lessons = await Collaboration.find({}).populate({
			path: 'class',
			select: 'language level teacher'
		})
		lessons.forEach( less => {
			events.push({
				title: `${less.class.language}(${less.class.level}), ${less.class.teacher}`,
				start: less.since,
				end: less.until,
				editable: true
			})
		})
		res.render('index', { title: 'Calendar', events});
		} catch (err) {
		next(err)
	}
});

  // {
  // 	createAt: 2018 - 04 - 19 T06: 00: 33.600 Z,
  // 	students: [5 ad83080222d84209af6adca],
  // 	_id: 5 ad83081222d84209af6af80,
  // 	class: 5 ad83081222d84209af6ade4,
  // 	status: 'review',
  // 	room: 'n1',
  // 	since: 2018 - 04 - 19 T04: 00: 33.550 Z,
  // 	until: 2018 - 04 - 19 T06: 00: 33.550 Z,
  // 	__v: 0
  // }, {
  // 	createAt: 2018 - 05 - 10 T06: 43: 32.348 Z,
  // 	students: [],
  // 	_id: 5 af3ea141705eb2a6abb098d,
  // 	status: 'planned',
  // 	class: 5 ae17914f54b44366532eb1b,
  // 	since: 2017 - 12 - 31 T23: 01: 00.000 Z,
  // 	until: 2018 - 01 - 01 T01: 00: 00.000 Z,
  // 	room: '2',
  // 	__v: 0
  // },

router.get('/teachers/add', isAuthorized, (req, res, next) => {
	res.render('teacher-add', {
		title: 'Create teacher'
	});
});


router.post('/teachers', isAdmin, hashingPassword, (req, res, next) => {
	const { email, name, phone, coeficient, password } = req.body;
	const teacher = new User({
		email,
		name,
		phone,
		coeficient,
		role: 'teacher',
		password
	});

	teacher
		.save()
		.then(teacher => {
			res.redirect(`/teachers/${teacher._id}`);
		})
		.catch(err => {
			next(err);
		})
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

router.get('/teachers/:id', isManager, async function(req, res, next) {
	const id = req.params.id;
	try {
		const teacher = await User.findById(id)
		res.render('teacher', { title: teacher.name, teacher });
	} catch(e) {
		next(e);
	}
});

router.get('/teachers/:id/edit', isAdmin, async (req, res, next) => {
	const id = req.params.id;
	try {
		const teacher = await User.findById(id);
		res.render('teacher-edit', {
			title: 'Edit teacher',
			teacher
		});
	} catch (e) {
		next(e)
	}
});

router.post('/teachers/:id', isAdmin, hashingPassword, async (req, res, next) => {
	const id = req.params.id;
	let tch = {
		email: req.body.email,
		name: req.body.name,
		phone: req.body.phone,
		coeficient: req.body.coeficient
	};

	if(req.body.password) {
		tch.password = req.body.password;
	}
	 password = req.body.password || undefined;
	console.log(req.body)

	try {
		const teacher = await User.findByIdAndUpdate({_id: id}, tch);
		res.redirect(`/teachers/${teacher._id}`);
	} catch (e) {
		next(e)
	}
});

function hashingPassword(req, res, next){
	if (!req.body.password) {
		delete req.body.password;
		return next();
	}

	bcrypt.hash(req.body.password, 10, (err, hash) => {
		if (err) throw err;
		req.body.password = hash;
		next()
	});
}

module.exports = router;
