var express = require('express');
var router = express.Router();

const wrap = require('express-async-wrap');
const models = require('../models');

router.post('/login', async (req, res) => {
  console.log(req.body);
  const user = await models.User.findOne({ // 유저 검색
    where: {
      user_id: req.body.email,
      password: req.body.password
    }
  });
  if(user) {
    delete req.body.password;
    res.send({ // 로그인 결과 response
      result: true,
      data: user
    });
  } else {
    res.send({
      result: false
    });
  }
});

router.post('/addTravel', wrap(async (req, res) => {
  console.log(req.body)
  const travel = await models.Travel.create({ 
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    total_budget: req.body.total_budget,
    start_date: req.body.start_date,
    end_date: req.body.end_date
  });
  if(travel) {
    res.send({
      result: true
    });
  } else {
    res.send({
      result: false
    });
  }
}));

module.exports = router;
