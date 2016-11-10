var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/contacts', function(req, res, next) {
  res.render('user/contacts');
});
router.get('/profile',function(req,res,next){
  res.render('user/profile');
});
router.get('/edit',function(req,res,next){
  res.render('user/edit');
});

module.exports = router;
