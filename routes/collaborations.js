const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin } = require('./../middlwares/auth');

const Collaboration = require('../models/collaboration');
const Student = require('../models/student');
const Paid = require('../models/paid');

router.patch('/:id', isAuthorized, async (req, res, next) => {
  const id = req.params.id;
  const presentStudents = JSON.parse(req.body.students);
  try {
    const coll = await Collaboration.findById(id).populate({path: 'class', select: 'price'});
    const students = await Student.find({_id: {$in: presentStudents}}).select('account');

    students.map(async student => {
      await Paid.create({ student: student._id, type: 'outcome', value: -coll.class.price });
      student.account -= coll.class.price;
      await student.save();
    });
    coll.students = presentStudents;
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
