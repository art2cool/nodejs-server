const express = require('express');
const router = express.Router();
const { isAuthorized, isAdmin } = require('./../middlwares/auth');

const Collaboration = require('../models/collaboration');

router.patch('/:id', isAuthorized, (req, res, next) => {
  const id = req.params.id;

  Collaboration
    .findById(id)
    .then(collaboration => {
      console.log(collaboration)
      res.send('ok')
    })
})

module.exports = router;
