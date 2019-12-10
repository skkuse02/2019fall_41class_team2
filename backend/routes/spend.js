var express = require('express');
var router = express.Router();

const wrap = require('express-async-wrap');
const models = require('../models');

router.get('/getSpends/:schedule_id', async function(req, res){
    const schedule_id = req.params.schedule_id;
    var spends = await models.Spend.findAll({ where : { schedule_id : schedule_id }});
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
    var data = (req.body);
    console.log(data);
    var detail = data.detail;
    var expense = data.expense;
    var schedule_id = data.schedule_id

    for(var i=0;i<detail.length;i++){
        await models.Spend.create({
            schedule_id : schedule_id,
            detail : detail[i],
            expense : expense[i]
        })
        if(i == detail.length-1){
            res.send({ result: true });
        }
    }
})

module.exports = router;