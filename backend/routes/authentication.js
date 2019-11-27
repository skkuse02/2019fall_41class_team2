var express = require('express');
var router = express.Router();

const wrap = require('express-async-wrap');
const models = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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

router.post('/idDuplicationCheck', async (req, res) =>{
  const user = await models.User.findOne({
    where: {
      user_id: req.body.email
    }
  });
  if(user){
    res.send({
      result: true
    });
  } else{
    res.send({
      result: false
    });
  }
});

router.post('/nicknameDuplicationCheck', async (req, res) =>{
  const user = await models.User.findOne({
    where: {
      nickname: req.body.nickname
    }
  });
  if(user){
    res.send({
      result: true
    });
  } else{
    res.send({
      result: false
    });
  }
});

router.post('/signup', wrap(async (req, res) => {
  const user = await models.User.create({ 
    user_id: req.body.email,
    password: req.body.password,
    name: req.body.username,
    nickname: req.body.nickname,
    authority: 1
  });
  if(user) {
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
