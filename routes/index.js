const express = require("express");
const router = express.Router();
const { isAuthorized, isAdmin, isManager } = require("./../middlwares/auth");

const Collaboration = require("../models/collaboration");

/* GET home page. */
router.get("/", isAuthorized, async (req, res, next) => {
  try {
    const events = [];
    // write it to aggregation
    let lessons = await Collaboration.find({}).populate({
      path: "class",
      select: "language level teacher room",
      populate: { path: "teacher", select: "name" }
    });

    lessons.forEach(less => {
      events.push({
        title: ` ${less.class.teacher.name}, ${less.class.language} (${
          less.class.level
        })`,
        start: less.since,
        end: less.until,
        editable: true,
        _id: less._id,
        resourceId: less.room
      });
    });
    const rooms = new Set();
    lessons.forEach(el => rooms.add(el.room));
    const resources = [...rooms].map(el => {
      return {
        id: el,
        room: el
      };
    });
    res.render("index", { title: "Calendar", events, resources });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
