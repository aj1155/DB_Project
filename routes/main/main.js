var express = require('express');
var router = express.Router();
var auth = require('../../join/auth');
/* GET home page. */
/* angular 이용시 토큰 으로 미들웨어 검사
router.use('/', auth.isAuthenticated(), function (req, res, next) {
    next();
});
*/
router.get('/', function(req, res, next) {
  //console.log(req.session.user);
//  console.log(req.isAuthenticated);

  res.render('main/main');
});

module.exports = router;
