var express = require('express');
var router = express.Router();
var Introduce = require('../../model/Introduce');
var sequelize = require('../../join/sequelize'); /* node.js orm sequelize 설정을 불러옴 */

/* GET home page. */
router.get('/introduce', function(req, res, next) {
  sequelize.authenticate().then(function(err){
    Introduce.findAll({
      where : {
        id : req.user.category_id
      }
    })
    .then(function(rows){
      res.render('guide/introduce',{body:rows[0].text});
    });
  })
  .catch(function(err){
    res.send(err);
  });
});




module.exports = router;
