var express = require('express');
var router = express.Router();
var auth = require('../../join/auth');
var userDao = require('../../query/user/user');
/* GET home page. */
/* angular 이용시 토큰 으로 미들웨어 검사
router.use('/', auth.isAuthenticated(), function (req, res, next) {
    next();
});
*/
router.get('/', function(req, res, next) {
  //console.log(req.session.user);
//  console.log(req.isAuthenticated);
  var sess = req.session;

  res.render('main/main', {
    user_id : sess.login_id
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
