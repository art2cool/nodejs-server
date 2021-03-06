
module.exports.isAuthorized = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.logout();
  res.redirect('/users/login')
}

module.exports.isAdmin = (req, res, next) => {
  if(req.user && req.user.role === 'admin') {
    return next();
  }
  req.logout();
  res.redirect('/users/login')
}

module.exports.isManager = (req, res, next) => {
  if(req.user && req.user.role === 'admin') {
    return next();
  }
  if(req.user && req.user.role === 'manager') {
    return next();
  }
  req.logout();
  res.redirect('/users/login')
}