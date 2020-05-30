const bcrypt = require("bcryptjs");

module.exports.hashingPassword =(req, res, next) => {
    if (!req.body.password) {
        delete req.body.password;
        return next();
    }

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) throw err;
        req.body.password = hash;
        next();
    });
}