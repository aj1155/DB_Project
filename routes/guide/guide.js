var express = require('express');
var router = express.Router();
var userDao = require('../../query/user/user');


/* GET home page. */
router.get('/introduce', function(req, res, next) {
  userDao.FindGrade(req.user.id, req.user.category_id, function(result){
    console.log(result);
    res.render('guide/introduce', {user : req.user, grade : result});
  });
});



module.exports = router;
