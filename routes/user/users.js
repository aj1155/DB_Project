var express = require('express');
var router = express.Router();
var userDao = require('../../query/user/user');

/* GET users listing. */
router.get('/contacts', function(req, res, next) {
  userDao.FindGrade(req.user.id, req.user.category_id, function(result){
    res.render('user/contacts', {user : req.user, grade : result});
  });
  /* res.render('user/contacts');*/
});
router.get('/profile',function(req,res,next){
  userDao.FindGrade(req.user.id, req.user.category_id, function(result){
    res.render('user/profile', {user : req.user, grade : result});
  });
  /* res.render('user/profile');*/
});
router.get('/edit',function(req,res,next){
  userDao.FindGrade(req.user.id, req.user.category_id, function(result){
    res.render('user/edit', {user : req.user, grade : result});
  });
  /* res.render('user/edit');*/
});

module.exports = router;
