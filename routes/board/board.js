var express = require('express');
var router = express.Router();
var boardDAO = require('../../query/board/board');
var pool = require('../../join/connection');
var Board_post = require('../../model/Board_post');
var sequelize = require('../../join/sequelize');
/*
router.get('/list',function(req,res,next){
  boardDAO.selectAll(function(rows){
    res.render('board/list',{
      row:rows
    })
  });
});
*/

router.get('/list/:currentPage',function(req,res,next){
  sequelize.authenticate().then(function(err){
    var currnetPage = req.params.currentPage;
    Board_post.findAll({
      where:{

      },
      limit: (15 * currnetPage)
    })
    .then(function(rows){
      res.render('board/list',{row:rows});
    });
  })
  .catch(function(err){
    res.send(err);
  });
});

router.get('/list/:srchType/:srchText/:currentPage',function(req,res,next){
  var srchType = req.params.srchType;
  var srchText = req.params.srchText;
  var currentPage = req.params.currentPage;
  if(srchType==1){
  sequelize.authenticate().then(function(err){
    Board_post.findAll({
        where:{
          title:srchText
        },
        limit : (15 * currentPage)
    })
    .then(function(rows){
      res.render('board/list',{row:rows});
    });
  })
  .catch(function(err){
    res.send(err);
  });
}else{
  sequelize.authenticate().then(function(err){
    Board_post.findAll({
        where:{
          user_name:srchText
        },
        limit : (15 * currentPage)
    })
    .then(function(rows){
      res.render('board/list',{row:rows});
    });
  })
  .catch(function(err){
    res.send(err);
  });
}
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
  var d = new Date();
  var date =(d.getFullYear()) + '-' +
    (d.getMonth() + 1) + '-' +
    (d.getDate()) + ' ';
  sequelize.authenticate().then(function(err){
    Board_post.create({
      board_id:1,
      title:req.body.title,
      content:req.body.content,
      create_time:date,
      user_name:'일준',
      user_id:'01093481037'
    })
    .then(function(rows){
      res.redirect('/board/list/1');
    });

  })
  .catch(function(err){
    res.send(err);
  });
});

router.get('/edit/:id',function(req,res,next){
  sequelize.authenticate().then(function(err){
    Board_post.findOne({
      where:{
        id:req.params.id
      }
    })
    .then(function(result){
      res.render('board/edit',{result:result});
    });
    })
    .catch(function(err){
      res.send(err);
    });
});

router.post('/edit/:id',function(req,res,next){
  var d = new Date();
  var date =(d.getFullYear()) + '-' +
    (d.getMonth() + 1) + '-' +
    (d.getDate()) + ' ';
  var updateObj ={
    title :req.body.title,
    content : req.body.content,
    create_time: date
  }
  var whereObj = {
    where : {
    id: req.params.id
    }
  }
  sequelize.authenticate().then(function(err){
    Board_post.update(updateObj,whereObj)
    .then(function(result){
      if(result==1){
        res.redirect('/board/read/'+req.params.id);
      }else{
        res.json("fail");
      }
    })
  })
  .catch(function(err){
    res.send(err);
  });
});

module.exports = router;
