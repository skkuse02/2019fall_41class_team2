var express = require('express');
var router = express.Router();

const wrap = require('express-async-wrap');
const models = require('../models');

router.post('/addSchedule', wrap(async (req, res) => {
  console.log(req.body)
  const schedule = await models.Schedule.create({ 
    title: req.body.title,
    content: req.body.content,
    latitude: req.body.marLat,
    longitude: req.body.marLon,
    budget: parseFloat(req.body.budget),
    start_time: req.body.time,
    end_time: req.body.time,
    date: req.body.date,
    travel_id: parseInt(req.body.travel_id),
    city_id: parseInt(req.body.city_id)
  });
  
  if(schedule) {
    res.send({
      result: true,
      data: schedule
    })
  } else {
    res.send({
      result: false
    });
  }
}));

router.get('/getSchedule/:tid', wrap(async (req, res) => {
  console.log("get sh")
  const schedule = await models.Schedule.findAll({
    where: {
      travel_id: req.params.tid
    }
  });
  if(schedule) {
    res.send({
      result: true,
      data: schedule
    });
  } else {
    res.send({
      result: false
    });
  }
}))

router.get('/getDateSchedule/:date', wrap(async (req, res) => {
  console.log("get da")
  const schedule = await models.Schedule.findAll({
    where: {
      date: req.params.date
    }
  });
  if(schedule) {
    res.send({
      result: true,
      data: schedule
    });
  } else {
    res.send({
      result: false
    });
  }
}))

router.get('/getScheduleById/:id', wrap(async (req, res) => {
  console.log("get id")
  const schedule = await models.Schedule.findOne({
    where: {
      schedule_id: req.params.id
    },
    include: [
      { model: models.City}
    ]
  });
  if(schedule) {
    res.send({
      result: true,
      data: schedule
    });
  } else {
    res.send({
      result: false
    });
  }
}))

router.get('/getCity', wrap(async (req, res) => {
  console.log("get city")
  const city = await models.City.findAll();
  if(city) {
    res.send({
      result: true,
      data: city
    });
  } else {
    res.send({
      result: false
    });
  }
}))


module.exports = router;
