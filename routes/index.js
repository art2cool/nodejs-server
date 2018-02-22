var express = require('express');
var router = express.Router();

var User = require('../models/user');
/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
	User.getAllUsers(function(err, users){
		if (err) throw err;
		res.render('index', { title: 'Members', users: users});
	});
});


function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login')
}

module.exports = router;
