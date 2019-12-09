var express = require('express');
var router = express.Router();

const wrap = require('express-async-wrap');
const models = require('../models');

router.get('/getSpends/:travel_id', async function(req, res){
    const travel_id = req.params.travel_id;
    var spends = await models.Spend.findAll({ where : { travel_id : travel_id }});
    if(spends) {
        res.send({
          result: true,
          data: spends
        });
      } else {
        res.send({
          result: false
        });
    }
})

router.post('/expenseUpdate', async function(req, res){
    console.log(req.body);
    await models.Spend.update({
        expense : req.body.expense
    }, { where : { spend_id : req.body.spend_id }});
    res.send({ result: true });
})