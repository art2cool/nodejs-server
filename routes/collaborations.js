const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin } = require('./../middlwares/auth');

const Collaboration = require('../models/collaboration');

router.patch('/:id', isAuthorized, (req, res, next) => {
  const id = req.params.id;
  const body = JSON.parse(req.body.students);
  console.log(body)
  Collaboration
    .findById(id)
    .then(collaboration => {

      collaboration.students = body;
      collaboration.status = 'finished';

      return collaboration.save();
    })
    .then(collaboration => {
      res.send('ok')
    })
    .catch(e => next(e));
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
