const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin } = require('./../middlwares/auth');

const Collaboration = require('../models/collaboration');
const Student = require('../models/student');
const Paid = require('../models/paid');
const Class = require('../models/classes');

router.patch('/:id', isAuthorized, async (req, res, next) => {
  const id = req.params.id;
  const allStudents = JSON.parse(req.body.students);
  console.log(JSON.parse(req.body.students));
  const presentStudents = allStudents
    .filter(el => el.present)
    .map(el => el.id);
  console.log(presentStudents)
  
  try {
    const coll = await Collaboration.findById(id);
    const clas = await Class.findById(coll.class).select('type price');

    const students = await Student.find({
      _id: { $in: allStudents.map(el => el.id) }
    }).select("account");

    students.map(async student => {
      await Paid.create({ student: student._id, type: 'outcome', value: -clas.price });
      student.account -= clas.price;
      await student.save();
    });
    coll.students = presentStudents
      
    coll.status = 'finished';
    
    await coll.save();

    res.send('ok');
  } catch(e) {
    next(e);
  }
})

router.post('/:id', async (req,res) => {
  let {date, since, until, room} = req.body;
  const _id = req.params.id;
  const clas = req.query.clas;
  since = new Date(`${date}T${since}:00`);
  until = new Date(`${date}T${until}:00`);
  try {
    const coll = await Collaboration.update({_id}, {since, until, room})
  } catch (err) {
    console.log(err)
  }
  res.redirect(`/classes/${clas}/lessons/${_id}`)
})

router.post('/', async (req,res) => {
  let {date, since, until, room} = req.body;
  const clas = req.query.class;
  since = new Date(`${date}T${since}:00`);
  until = new Date(`${date}T${until}:00`);

  const newColl = Collaboration.create({
    status: 'planned',
    class: clas,
    since, until, room
  })

  res.redirect(`/classes/${clas}`)
})

router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const coll = await Collaboration.findByIdAndRemove(id)
    res.send({coll});
  } catch (e) {
    next(e);
  }
})

module.exports = router;
