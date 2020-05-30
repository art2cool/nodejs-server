const express = require("express");
const router = express.Router();
const { isAuthorized, isAdmin, isManager } = require("./../middlwares/auth");

const Collaboration = require("../models/collaboration");
const Class = require("../models/classes");
const Student = require("../models/student");
const Paid = require("../models/paid");
/* GET home page. */
router.get("/add", isAuthorized, (req, res, next) => {
  res.render("student-add", {
    title: "Create student"
  });
});

router.get("/", isAdmin, (req, res, next) => {
  Student.find({})
    .sort({ name: 1 })
    .then(students => {
      res.render("students", { title: "Students", students });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/:id", isAuthorized, async function(req, res, next) {
  const id = req.params.id;
  try {
    const student = await Student.findById(id);
    const paids = await Paid.find({ student: id }).sort({ date: -1 });
    res.render("student", { title: student.name, student, paids });
  } catch (e) {
    next(e);
  }
});

router.get("/:id/edit", isAuthorized, async function(req, res, next) {
  const id = req.params.id;
  try {
    const student = await Student.findById(id);
    res.render("student-edit", { title: student.name, student });
  } catch (e) {
    next(e);
  }
});

router.post("/", isAdmin, async (req, res, next) => {
  const {
    name,
    email,
    phone,
    language,
    level,
    dayOfBirth,
    account,
    notes
  } = req.body;
  const student = new Student({
    name,
    email,
    phone,
    language,
    level,
    dayOfBirth,
    account,
    notes
  });
  try {
    const st = await student.save();
    const type = account > 0 ? "income" : "outcome";
    await Paid.create({ student: st._id, type, value: account });
    res.redirect(`/students/${st._id}`);
  } catch (e) {
    next(e);
  }
});

router.post("/:id", isAdmin, async (req, res, next) => {
  const id = req.params.id;
  const {
    name,
    email,
    phone,
    language,
    level,
    dayOfBirth,
    account,
    notes
  } = req.body;
  try {
    const student = await Student.findById(id);

    if (student.account !== account) {
      const type = student.account < account ? "income" : "outcome";
      const subtraction = account - student.account;
      await Paid.create({ student: student._id, type, value: subtraction });
    }

    student.name = name;
    student.email = email;
    student.phone = phone;
    student.language = language;
    student.level = level;
    student.dayOfBirth = dayOfBirth;
    student.account = account;
    student.notes = notes;

    await student.save();
    res.redirect(`/students/${student._id}`);
  } catch (e) {
    next(e);
  }
});

router.post("/:id/payment", isManager, async (req, res, next) => {
  const id = req.params.id;
  const value = ~~req.body.value;
  const type = value > 0 ? "income" : "outcome";
  try {
    await Paid.create({ student: id, type, value });
    const student = await Student.findById(id);
    student.account += value;
    await student.save();
    res.json(student);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", isManager, async (req, res, next) => {
  const id = req.params.id;
  try {
    const student = Student.findByIdAndRemove(id);
    const paid = Paid.remove({ student: id });
    const coll = Collaboration.updateMany(
      { students: id },
      { $pull: { students: id } }
    );
    const clas = Class.updateMany(
      { students: id },
      { $pull: { students: id } }
    );

    await Promise.all([student, paid, coll, clas]);

    res.send({ redirect: `students` });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
