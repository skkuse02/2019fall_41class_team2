var express = require('express');
var router = express.Router();

const wrap = require('express-async-wrap');
const models = require('../models');

router.post('/addSchedule', wrap(async (req, res) => {
  console.log(req.body)
  const schedule = await models.Schedule.create({ 
    title: req.body.title,
    content: req.body.content,
    latitude: req.body.lat,
    longitude: req.body.lon,
    budget: req.body.budget,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    date: req.body.date,
    travel_id: parseInt(req.body.travel),
    city_id: parseInt(req.body.city)
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

router.post('/addNation', wrap(async (req, res) => {
  const cities = await models.City.findAll({
    where: {
      capital: 'primary'
    }
  });
  for (let i = 0; i < cities.length; i += 1) {
    const nation = await models.Nation.create({
      name: cities[i].country,
      latitude: cities[i].latitude,
      longitude: cities[i].longitude,
    });
  }
}))

router.get('/getNation', wrap(async (req, res) => {
  const nation = await models.Nation.findAll({
    attributes: ['nation_id', 'name']
  });
  if(nation) {
    res.send({
      result: nation,
      data: nation
    });
  } else {
    res.send({
      result: false
    });
  }
}))

router.get('/getTravel/:uid', wrap(async (req, res) => {
  const list = await models.User_Travel.findAll({
    where: {
      user_id: req.params.uid
    },
    order: [
      ['travel_id', 'DESC']
    ]
  });
  let travels = []
  if(list){
    for( let i = 0; i < list.length; i++){
      const travel = await models.Travel.findOne({
        where: {
          travel_id: list[i].travel_id
        },
        include: [
          { model: models.Nation}
        ]
      })
      travels.push(travel)
    }
    if(travels) {
      res.send({
        result: true,
        data: travels
      });
    } else {
      res.send({
        result: false
      });
    }
  } else {
    res.send({
      result: false,
      data: 'No data'
    })
  }
  
}))

module.exports = router;
