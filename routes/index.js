
const bcrypt = require('bcrypt')
const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin, isManager } = require('./../middlwares/auth');

const User = require('../models/user');
const Collaboration = require('../models/collaboration');
const Class = require('../models/classes');
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
