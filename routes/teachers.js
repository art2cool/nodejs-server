const express = require("express");
const router = express.Router();
const { isAuthorized, isAdmin, isManager } = require("./../middlwares/auth");
const User = require("../models/user");
const { hashingPassword } = require("./../services/auth");
const Class = require("../models/classes");

router.get("/add", isAuthorized, (req, res, next) => {
  res.render("teacher-add", {
    title: "Create teacher"
  });
});

router.post("/", isAdmin, hashingPassword, (req, res, next) => {
  const { email, name, phone, password } = req.body;
  const teacher = new User({
    email,
    name,
    phone,
    role: "teacher",
    password
  });

  teacher
    .save()
    .then(teacher => {
      res.redirect(`/teachers/${teacher._id}`);
    })
    .catch(err => {
      next(err);
    });
});

router.get("/", isManager, function(req, res, next) {
  User.find({ role: "teacher" })
    .then(teachers => {
      res.render("teachers", { title: "Teachers", teachers });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/:id", isManager, async function(req, res, next) {
  const id = req.params.id;
  try {
    const teacher = await User.findById(id);

    res.render("teacher", { title: teacher.name, teacher });
  } catch (e) {
    next(e);
  }
});

router.get("/:id/edit", isAdmin, async (req, res, next) => {
  const id = req.params.id;
  try {
    const teacher = await User.findById(id);
    res.render("teacher-edit", {
      title: "Edit teacher",
      teacher
    });
  } catch (e) {
    next(e);
  }
});

router.post("/:id", isAdmin, hashingPassword, async (req, res, next) => {
  const id = req.params.id;
  let tch = {
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
  };

  if (req.body.password) {
    tch.password = req.body.password;
  }
  password = req.body.password || undefined;

  try {
    const teacher = await User.findByIdAndUpdate({ _id: id }, tch);
    res.redirect(`/teachers/${teacher._id}`);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
