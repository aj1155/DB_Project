var express = require('express');
var router = express.Router();
var boardDAO = require('../../query/board/board');
var pool = require('../../join/connection');
var userDao = require('../../query/user/user');

router.get('/list',function(req,res,next){
  boardDAO.selectAll(function(rows){
    res.render('board/list',{
      row:rows
    })

  });
});

router.get('/read/:id',function(req,res,next){
  boardDAO.selectById([req.params.id],function(rows){
    res.render('board/read',{
      rows:rows
    })
  });
});

router.get('/write',function(req,res,next){
  res.render('board/write');
});

router.post('/write',function(req,res,next){
  boardDAO.board_insert([req.body.title,req.body.content],function(result){
    if(result){
      console.log('success');
      res.redirect('board/list');
    }
  });
});
module.exports = router;
