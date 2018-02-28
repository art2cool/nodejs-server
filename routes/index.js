const express = require('express');
const router = express.Router();
const { isAuthorized } = require('./../middlwares/auth');

const User = require('../models/user');
/* GET home page. */
router.get('/', isAuthorized, function(req, res, next) {
	User
		.find({})
		.then( users => {
			res.render('index', { title: 'Members', users: users});
		})
		.catch(err => {
			next(err)
		})
});



module.exports = router;
