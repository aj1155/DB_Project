var express = require('express');
var router = express.Router();
var boardDAO = require('../../query/board/board');
var pool = require('../../join/connection');
var Board_post = require('../../model/Board_post');
var sequelize = require('../../join/sequelize');
var commentDAO = require('../../query/comment/comment');
var Comment = require('../../model/Comment');
var formidable = require('formidable');
var fileDAO = require('../../query/file/file');
var multiparty = require('multiparty');
var fs = require('fs');
var formidable = require('formidable');
var mime = require('mime');
/*session user정보를 local에 저장하여 ejs파일로
 명시적으로 넘겨주지않아도 자동적으로 넘어감 세션값 사용시 user로 꺼내쓰면됨*/
router.use(function (req, res, next) {
    if (req.user) res.locals.user = req.user;
    else res.locals.user = undefined;
    next();
});

router.get('/list/:board_id',function(req,res,next){
  var board_id=req.params.board_id;
  if(req.params.srchType!=null){
    var srchType=req.params.srchType;
  }else{
    var srchType=0;
  }
  if(req.params.srchText!=null){
    var srchText=req.params.srchText;
  }else {
    var srchText= "";
  }
  var currentPage=1;
  var pageSize = 15;
  var params=[currentPage,srchType,srchText,pageSize,board_id];
  boardDAO.selectList(params,function(rows){
    res.render('board/list',{board_id:board_id,row:rows,currentPage:currentPage,srchType:srchType,srchText:"",currentPage:currentPage,is_admin:req.user.is_admin});
  });
});

router.post('/list/:board_id',function(req,res,next){
  var params=[1,req.body.srchType,req.body.srchText,15,req.params.board_id];
  boardDAO.selectList(params,function(rows){
    res.render('board/list',{
      row:rows,board_id:req.params.board_id,srchText:req.body.srchText,srchType:req.body.srchType,currentPage:1,is_admin:req.user.is_admin
    });
  });
});

router.get('/list/:currentPage/:srchType/:srchText/:board_id',function(req,res,next){
  var srchText=0;
  if(req.params.srchText!=""){
    srchText=req.params.srchText;
  }
  var pageSize=15;
  var params=[req.params.currentPage,req.params.srchType,srchText,pageSize,req.params.board_id];
  boardDAO.selectList(params,function(rows){
    res.json(rows);
  });
});
/*1은 공지사항 2는 자유게시판*/
router.get('/read/:board_id/:id',function(req,res,next){
  boardDAO.selectById([req.params.id],function(rows){
    commentDAO.selectByBoard_id([req.params.id],function(row){
      fileDAO.selectByBoard_id([req.params.id],function(file){
        res.render('board/read',{rows:rows,row:row,file:file,userId:req.user.id,board_id:req.params.board_id});
      });
    });
  });
});

router.get('/write/:board_id', function (req, res, next) {
    var board_id = req.params.board_id;
    res.render('board/write', {board_id: board_id});
});
router.post('/write/:board_id',function(req,res,next){
  var d = new Date();
  var board_id = req.params.board_id;
  var date =(d.getFullYear()) + '-' +
    (d.getMonth() + 1) + '-' +
    (d.getDate()) + ' ';
  var user_name = req.user.name;
  var user_id = req.user.id;
  var form = new multiparty.Form();
  form.parse(req,function(err,fields,files){
    var title=String(fields.title);
    var content= String(fields.content);
    var param=[board_id,title,content,date,user_name,user_id];
    sequelize.authenticate().then(function(err){
      Board_post.create({
        board_id : board_id,
        title: title,
        content : content,
        user_name : user_name,
        create_time : date,
        user_id : user_id
      })
      .then(function(results){
        var f=files.file[0];
        var fileName=f.originalFilename;
        var fileSize=f.size;
        fs.readFile(f.path,function(err,data){
          var fileData=data;
          var params=[fileName,fileSize,fileData,results.id];
          fileDAO.insert(params,function(result){
            res.redirect('/board/read/'+board_id+'/'+results.id);
          });
        });
      });
    })
    .catch(function(err){
      console.log(err);
    });
  });
});

router.get('/edit/:board_id/:id',function(req,res,next){
    sequelize.authenticate().then(function(err){
        Board_post.findOne({
            where: {
                id: req.params.id
            }
        })
            .then(function(result){
              fileDAO.selectByBoard_id(req.params.id,function(files){
                if(files===undefined){
                  res.render('board/edit',{result:result,files:null,board_id:req.params.board_id});
                }else{
                  res.render('board/edit',{result:result,files:files,board_id:req.params.board_id});
                }
              });
          });
    })
        .catch(function (err) {
            res.send(err);
        });
});

router.get('/fileEdit/:board_id/:id',function(req,res,next){
  boardDAO.selectById(req.params.id,function(row){
    fileDAO.selectByBoard_id(req.params.id,function(file){
      res.render('board/fileEdit',{result:row,files:file,board_id:req.params.board_id});
    });
  });
});

router.post('/fileEdit/:board_id/:id',function(req,res,next){
  fileDAO.boardDelete(req.params.id,function(row){
    var form = new multiparty.Form();
    form.parse(req,function(err,fields,files){
      var f=files.file[0];
      var fileName=f.originalFilename;
      var fileSize=f.size;
      fs.readFile(f.path,function(err,data){
        var fileData=data;
        var params=[fileName,fileSize,fileData,req.params.id];
        fileDAO.insert(params,function(result){
          res.redirect('/board/read/'+req.params.board_id+'/'+req.params.id);
        });
      });
    });
  });
});
router.post('/edit/:board_id/:id',function(req,res,next){
    var d = new Date();
    var date = (d.getFullYear()) + '-' +
        (d.getMonth() + 1) + '-' +
        (d.getDate()) + ' ';
      var params=[req.body.title,req.body.content,date,req.params.id];
      boardDAO.update(params,function(row){
        res.redirect('/board/read/'+req.params.board_id+'/'+req.params.id);
      });
  });

router.get('/CommentCreate/:id/:message',function(req,res,next){
  var d = new Date();
  var date =(d.getFullYear()) + '-' +
    (d.getMonth() + 1) + '-' +
    (d.getDate()) + ' ';
  var name = req.user.name;
  var user_id = req.user.id;
  var board_id = req.params.id;
  var content = req.params.message;
  var group_id;
  if(req.params.group_id!=null){
     group_id = req.params.group_id;
  }else {
    group_id = 1;
  }
  var parent_id = req.params.comment_id;
  sequelize.authenticate().then(function(err){
    Comment.create({
      board_id : board_id,
      content : content,
      user_name : name,
      write_time : date,
      user_id : user_id
    })
    .then(function(results){
      var id = results.id;
      commentDAO.defaultUpdate(board_id,results.id,function(result){
        res.json(results);
      });
    });
  })
  .catch(function(err){
    console.log(err);
  });
});

router.get('/CommentDelete/:board_id', function (req, res, next) {
    sequelize.authenticate().then(function (err) {
        Comment.destroy({
            where: {
                parent_id: req.params.board_id
            }
        })
            .then(function (results) {
                res.json(results);
            });
    })
        .catch(function (err) {
            console.log(err);
        });
});

router.get('/CommentCreate2/:board_id/:message/:parent_id/:group_id',function(req,res,next){
  var d = new Date();
  var date =(d.getFullYear()) + '-' +
    (d.getMonth() + 1) + '-' +
    (d.getDate()) + ' ';
  var name = req.user.name;
  var user_id = req.user.id;
  var parent_id = req.params.parent_id;
  var board_id = req.params.board_id;
  var content = req.params.message;
  var group_id = req.params.group_id;
  var param=[board_id,group_id,parent_id];
  var params=[board_id,content,name,date,user_id,group_id,group_id,board_id,board_id,group_id,parent_id];
  commentDAO.childCommentCreateBefore(param,function(result){
    commentDAO.commentCreate(params,function(results){
      results.user_name=name;
      res.json(results);
    });
  });
});
//image = "data:image/*;base64,"+new Buffer(data.data,'base64').toString('ascii');

router.get('/download/:id',function(req,res,next){
  fileDAO.selectById(req.params.id,function(file){
    var s=file[0];
    var data=s.data;
    var filename=s.name.toString("euc-kr");
    res.writeHead(200,{
      'Content-Type':'application/octet-stream;charset=utf-8',
      'Content-disposition':'attachment;filename='+encodeURI(filename)
    });
    res.end(new Buffer(data,'binary'));
  });
});

router.get('/delete/:id/:board_id',function(req,res,next){
  fileDAO.boardDelete(req.params.id,function(result1){
    commentDAO.delete(req.params.id,function(reuslt2){
      boardDAO.delete(req.params.id,function(result3){
        res.redirect('/board/list/'+req.params.board_id);
      });
    });
  });
});

router.get('/deleteFile/:id',function(req,res,next){
  fileDAO.delete(req.params.id,function(results){
    res.json("success");
  });
});

module.exports = router;
