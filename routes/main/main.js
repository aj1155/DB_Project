var express = require('express');
var router = express.Router();
var auth = require('../../join/auth');
var userDao = require('../../query/user/user');
// var menuDao = require('../../query/menu/menu');

/* GET home page. */
/* angular 이용시 토큰 으로 미들웨어 검사
router.use('/', auth.isAuthenticated(), function (req, res, next) {
    next();
});
*/
router.get('/', function(req, res, next) {
  userDao.FindGrade(req.user.id, req.user.category_id, function(result){
    console.log(result);
    console.log(result[0]);
    res.render('main/main', {user : req.user, grade : result});
  });
});


/* session destroy 후 home으로 redirect*/
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if(err) {
      console.log('err');
    }
    res.redirect('/home');
  });
});

module.exports = router;
