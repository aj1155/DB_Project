var express = require('express');
var router = express.Router();
var auth = require('../../join/auth');
var Board_post = require('../../model/Board_post');
var sequelize = require('../../join/sequelize');
var boardDAO = require('../../query/board/board');
/* GET home page. */
/* angular 이용시 토큰 으로 미들웨어 검사
router.use('/', auth.isAuthenticated(), function (req, res, next) {
    next();
});
*/
router.get('/', function(req, res, next) {
  //console.log(req.session.user);
//  console.log(req.isAuthenticated);
  var user_category_id = req.user.category_id;
  boardDAO.selectByCategory_id(user_category_id,function(results){
    sequelize.authenticate().then(function(err){
      Board_post.findAll({
        where : {
          board_id : (user_category_id * 2 -1)
        },
        limit : 5
      })
      .then(function(rows){
        res.render('main/main',{row:rows,list:results});
      });
    })
    .catch(function(err){
      console.log(err);
    });
  });
});

module.exports = router;
