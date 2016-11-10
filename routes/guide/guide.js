var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/introduce', function(req, res, next) {
  res.render('guide/introduce');
});



module.exports = router;
