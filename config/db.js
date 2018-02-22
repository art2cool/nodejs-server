var mongoose = require("mongoose");

var db = mongoose.connection;

const mongoUrl = 'mongodb://localhost/nodeauth';

mongoose.Promise = global.Promise;

var db = mongoose.createConnection(mongoUrl)

db.on("error", function (err) {
  if (err) {
    throw err;
  }
});
db.on('close', () => {
  console.log('Mongo DB closed.connection')
})

db.once("open", function callback() {
  console.log("Mongo DB connected successfully");
});

module.exports = db;
