var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/request', function(req, res, next) {
  res.render('admin/request');
});
router.get('/send', function(req, res, next) {
  res.render('admin/send');
});
router.get('/guide', function(req, res, next) {
  res.render('admin/guide');
});



module.exports = router;
