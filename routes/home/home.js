var express = require('express');
var router = express.Router();
var passport = require('../../join/passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home/main');
});
router.get('/login/:category', function(req, res, next) {
  res.render('home/login');
});
/* POST action으로 들어온 인증처리를 /login에서 하도록 하고 passport.authenticate를 ‘local’ strategy로 호출한다.*/
router.post('/login/:category', passport.authenticate('local', {
    successRedirect: '/main', // 로그인 성공 Redirect URL
    failureRedirect: '/home', // 로그인 실패 Redirect URL
}));

router.get('/ipfind', function(req, res, next) {
  res.render('home/IPfind');
});


module.exports = router;
