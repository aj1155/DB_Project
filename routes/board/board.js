var express = require('express');
var router = express.Router();
var boardDAO = require('../../query/board/board');
var pool = require('../../join/connection');
var Board_post = require('../../model/Board_post');
var sequelize = require('../../join/sequelize');
var Comment = require('../../model/Comment');
/*
router.get('/list',function(req,res,next){
  boardDAO.selectAll(function(rows){
    res.render('board/list',{
      row:rows
    })
  });
});
*/
/*1은 공지사항 2는 자유게시판*/
router.get('/list/:board_id',function(req,res,next){
  var currentPage = req.params.currentPage;
  var board_id = req.params.board_id;
  var category_id = req.user.cateogry_id;
  if(board_id=="1"){
    category_id = (Number(category_id) * 2 -1);
    baord_id = category_id;
  }else{
    category_id = Number(category_id) * 2;
    baord_id = category_id;
  }
  if(!currentPage){
    currentPage=1;
  }else{
    currentPage = Number(currentPage)+1;
  }
  sequelize.authenticate().then(function(err){
    Board_post.findAll({
      where:{
        board_id : board_id
      },
      limit: ( 15 * currentPage)
    })
    .then(function(rows){
      res.render('board/list',{board_id:board_id,row:rows,currentPage:currentPage,srchType:"",srchText:""});
    });
  })
  .catch(function(err){
    console.log(err);
  });
});
router.post('/list/:board_id',function(req,res,next){
  var srchType = req.body.srchType;
  var srchText = req.body.srchText;
  var currentPage = 1;
  var board_id = req.params.board_id;
  var category_id = Number(req.user.cateogry_id);
  if(board_id=="1"){
    category_id = (Number(category_id) * 2 -1);
    baord_id = category_id;
  }else{
    category_id = Number(category_id) * 2;
    baord_id = category_id;
  }
  if(srchType == "title"){
  sequelize.authenticate().then(function(err){
    Board_post.findAll({
      where : {
        $and:[{title : srchText},{board_id:board_id}]
      },
      limit : ( 15 * currentPage)
    })
    .then(function(rows){
      res.render('board/list',{board_id:board_id,row:rows,srchType:srchType,srchText:srchText,currentPage:currentPage});
    });
  })
  .catch(function(err){
    console.log(err);
  });
}else if(srchType == "user_name"){
  sequelize.authenticate().then(function(err){
    Board_post.findAll({
      where : {
        $and:[{user_name : srchText},{board_id:board_id}]
      },
      limit : ( 15 * currentPage)
    })
    .then(function(rows){
      res.render('board/list',{board_id:board_id,row:rows,srchType:srchType,srchText:srchText,currentPage:currentPage});
    });
  })
  .catch(function(err){
    console.log(err);
  });
}else{
  sequelize.authenticate().then(function(err){
    Board_post.findAll({
      where : {
        board_id : board_id
      },
      limit : ( 15 * currentPage)
    })
    .then(function(rows){
      res.render('board/list',{board_id:board_id,row:rows,srchType:srchType,srchText:srchText,currentPage:currentPage});
    });
  })
  .catch(function(err){
    console.log(err);
  });
}
});
router.get('/list/:board_id/:srchType/:srchText/:currentPage',function(req,res,next){
  var currentPage = req.params.currentPage;
  currentPage = Number(currentPage);
  var nextPage = currentPage+1;
  var srchType = req.params.srchType;
  var srchText = req.params.srchText;
  var board_id = req.params.board_id;
  var category_id = Number(req.user.cateogry_id);
  if(board_id=="1"){
    category_id = (Number(category_id) * 2 -1);
    baord_id = category_id;
  }else{
    category_id = Number(category_id) * 2;
    baord_id = category_id;
  }
  if(srchType == "title"){
    sequelize.authenticate().then(function(err){
      Board_post.findAll({
        where : {
          $and:[{title : srchText},{board_id : board_id}]
        },
        limit : ( 15 * nextPage )
      })
      .then(function(rows){
        res.render('board/list',{board_id:board_id,row:rows,currentPage:nextPage,srchType:srchType,srchText:srchText});
      });
    })
      .catch(function(err){
        console.log(err);
      });
  }else if(srchType == "user_name"){
    sequelize.authenticate().then(function(err){
      Board_post.findAll({
        where : {
          $and:[{user_name : srchText},{board_id:board_id}]
        },
        limit : ( 15 * nextPage )
      })
      .then(function(rows){
        res.render('board/list',{board_id:board_id,row:rows,currentPage:nextPage,srchType:srchType,srchText:srchText});
      });
    })
      .catch(function(err){
        console.log(err);
      });
  }
});
router.get('/list/:board_id/:currentPage',function(req,res,next){
  var currentPage = req.params.currentPage;
  currentPage = Number(currentPage);
  var nextPage = currentPage+1;
  var srchType = req.params.srchType;
  var srchText = req.params.srchText;
  var board_id = req.params.board_id;
  var category_id = Number(req.user.cateogry_id);
  if(board_id=="1"){
    category_id = (Number(category_id) * 2 -1);
    baord_id = category_id;
  }else{
    category_id = Number(category_id) * 2;
    baord_id = category_id;
  }
  if(!srchType){
  sequelize.authenticate().then(function(err){
    Board_post.findAll({
      where : {
        board_id : board_id
      },
      limit : ( 15 * currentPage )
    })
    .then(function(rows){
      res.render('board/list',{board_id:board_id,row:rows,currentPage:nextPage,srchType:"",srchText:""});
    });
  })
    .catch(function(err){
      console.log(err);
    });
  }else if(srchType == "title"){
    sequelize.authenticate().then(function(err){
      Board_post.findAll({
        where : {
          $and:[{title : srchText},{board_id : board_id}]
        },
        limit : ( 15 * nextPage )
      })
      .then(function(rows){
        res.render('board/list',{board_id:board_id,row:rows,currentPage:nextPage,srchType:srchType,srchText:srchText});
      });
    })
      .catch(function(err){
        console.log(err);
      });
  }else if(srchType == "user_name"){
    sequelize.authenticate().then(function(err){
      Board_post.findAll({
        where : {
          $and:[{user_name : srchText} , {board_id : board_id}]
        },
        limit : ( 15 * nextPage )
      })
      .then(function(rows){
        res.render('board/list',{board_id:board_id,row:rows,currentPage:nextPage,srchType:srchType,srchText:srchText});
      });
    })
      .catch(function(err){
        console.log(err);
      });
  }
});
router.post('/list/:board_id/:currentPage',function(req,res,next){
  var currentPage=1;
  var srchType = req.body.srchType;
  var srchText = req.body.srchText;
  var board_id = req.params.board_id;
  var category_id = Number(req.user.cateogry_id);
  if(board_id=="1"){
    category_id = (Number(category_id) * 2 -1);
    baord_id = category_id;
  }else{
    category_id = Number(category_id) * 2;
    baord_id = category_id;
  }
  if(srchType == "title"){
    sequelize.authenticate().then(function(err){
      Board_post.findAll({
        where : {
          $and:[{title : srchText},{board_id : board_id}]
        },
        limit : ( 15 * currentPage )
      })
      .then(function(rows){
        res.render('board/list',{board_id:board_id,row:rows,currentPage:currentPage,srchType:srchType,srchText:srchText});
      });
    })
      .catch(function(err){
        console.log(err);
      });
  }else{
    sequelize.authenticate().then(function(err){
      Board_post.findAll({
        where : {
          $and:[{user_name : srchText},{board_id:board_id}]
        },
        limit : ( 15 * currentPage )
      })
      .then(function(rows){
        res.render('board/list',{board_id:board_id,row:rows,currentPage:currentPage,srchType:srchType,srchText:srchText});
      });
    })
      .catch(function(err){
        console.log(err);
      });
  }
});


router.get('/read/:id',function(req,res,next){
  boardDAO.selectById([req.params.id],function(rows){
    sequelize.authenticate().then(function(err){
      Comment.findAll({
        where : {
          board_id : req.params.id
        }
      })
      .then(function(list){
        res.render('board/read',{
          rows:rows,list:list
        });
      });
    })
    .catch(function(err){
      console.log(err);
    });
  });
});

router.get('/write/:board_id',function(req,res,next){
  var board_id = req.params.board_id;
  res.render('board/write',{board_id:board_id});
});

router.post('/write/:board_id',function(req,res,next){
  var d = new Date();
  var board_id = req.params.board_id;
  var date =(d.getFullYear()) + '-' +
    (d.getMonth() + 1) + '-' +
    (d.getDate()) + ' ';
  var user_name = req.user.name;
  var user_id = req.user.id;
  sequelize.authenticate().then(function(err){
    Board_post.create({
      board_id : board_id,
      title : req.body.title,
      content : req.body.content,
      create_time : date,
      user_id : user_id,
      user_name : user_name
    })
    .then(function(rows){
      res.redirect('/board/list/'+board_id+'/1');
    });
  })
  .catch(function(err){
    console.log(err);
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

router.get('/commentCreate/:id',function(err){
  var d = new Date();
  var date =(d.getFullYear()) + '-' +
    (d.getMonth() + 1) + '-' +
    (d.getDate()) + ' ';
  var name = req.user.name;
  var user_id = req.user.id;
    sequelize.authenticate().then(function(err){
      Comment.create({
        board_id : id,
        content : req.body.content,
        user_name : name,
        write_time : date,
        user_id : user_id
      })
      .then(function(result){
        res.json(result);
      });
    })
      .catch(function(err){
        console.log(err);
      });
});
module.exports = router;
