var express = require('express');
var router = express.Router();
var User = require('../../model/User');
var Introduce = require('../../model/Introduce');
var sequelize = require('../../join/sequelize'); /* node.js orm sequelize 설정을 불러옴 */
var multer = require('multer'); /*mutipart/form-data 처리를 위한 미들웨어*/
var exUd = require('../../services/excelUpload');
var exTJ = require('../../services/excelToJson');
var addRows = require('../../services/addRows');
var userDao = require('../../query/user/user');

/* GET home page. */
router.get('/request', function(req, res, next) {
  userDao.FindGrade(req.user.id, req.user.category_id, function(result){
    res.render('admin/request', {user : req.user, grade : result});
  });
  /* res.render('admin/request');*/
});
router.get('/send', function(req, res, next) {
  userDao.FindGrade(req.user.id, req.user.category_id, function(result){
    res.render('admin/send', {user : req.user, grade : result});
  });
  /* res.render('admin/send');*/
});
router.get('/guide', function(req, res, next) {
  userDao.FindGrade(req.user.id, req.user.category_id, function(result){
    res.render('admin/guide', {user : req.user, grade : result});
  });
  /* res.render('admin/guide');*/
});
router.post('/guide',function(req,res,next){
  var body = req.body;
  var updateObj = {
    text : body.editor1
  };
  var whereObj = {
    where : {
      id : req.user.category_id
    }
  };
  Introduce.update(updateObj,whereObj)
  .then(function(result){
    console.log(result);
    if(result == 1){
      res.render("admin/guide",{msg:'success'});
    }else{
      res.render("admin/guide",{msg:'fail'});
    }
  });



});

//작성자 : 강철진 11/11 내용 :user 추가 편집 삭제 라우트설정
router.get('/userManage', function(req, res ,next) {
  sequelize.authenticate().then(function(err){
    userDao.FindGrade(req.user.id, req.user.category_id, function(result){
      res.render('admin/userManage', {user : req.user, grade : result, list:""});
    });
    /* res.render('admin/userManage',{list:""});*/
    User.findAll({
      where : {
        category_id : req.user.category_id
      },
      limit: 10
    })
    .then(function(rows){
      res.render('admin/userManage',{userList:rows});
    });
  })
  .catch(function(err){
    res.send(err);
  });
});


/*User삽입*/
router.post('/user',function(req,res,next){
  User.create({
    login_id : req.body.login_id,
    name : req.body.name,
    password : req.body.password,
    phone_number : req.body.phone_number,
    birth : req.body.birth,
    company_number : req.body.company_number,
    email : req.body.email,
    category_id : req.user.category_id,
    grade : req.body.grade,
    social_status : req.body.social_status
  })
  .then(function(result){
    console.log(result); /* 방금 삽입된 User를 가져옴 id가 AutoIncrement이기 때문에 여기서 채워진 id를 get한다*/
    User.findAll({
      where : {
        category_id : req.user.category_id
      },
      limit: 10
    })
    .then(function(rows){
      res.render('admin/userManage',{userList:rows});
    });
  });
});

/* Excel 다중 User 처리*/
router.post('/userExcel',function(req,res){
  var exceltojson;
  exUd.upload(req,res,function(err){
    if(err){
           res.json({error_code:1,err_desc:err});
           return;
      }
      /** Multer gives us file info in req.file object */
      if(!req.file){
          res.json({error_code:1,err_desc:"업로드 파일이 없습니다."});
          return;
      }

      exTJ.exToJson(req,function(result){
        if(result == 'fail'){
          res.redirect('/user',{msg : 'error'});
        }
        else{
          addRows.insert(result,req.user.id,function(msg){
              if(msg == "success"){
                User.findAll({
                  where : {
                    category_id : req.user.category_id
                  },
                  limit: 10
                })
                .then(function(rows){
                  res.render('admin/userManage',{userList:rows});
                });

              }
          });
          //res.render('admin/userManage',{list : result});
        }
      });

  });

});

/*사용자 삭제*/
router.delete('/user',function(req,res,next){


    var list = req.body.list.replace(/[^0-9.,]/g, "");
    var id = list.split(',');
      User.destroy({
              where:{
                id : id
              }
      })
      .then(function(result){
        console.log(result);
        res.json('success');
      });

});

/*사용자 편집*/
router.put('/user',function(req,res){
   var updateObj = {
     login_id : req.body.login_id,
     name : req.body.name,
     password : req.body.password,
     phone_number : req.body.phone_number,
     birth : req.body.birth,
     company_number : req.body.company_number,
     email : req.body.email,
     category_id : req.body.category_id,
     grade : req.body.grade,
     social_status : req.body.social_status
   };

   var whereObj = {
     where : {
       id : req.body.id
     }
   };

   User.update(updateObj,whereObj)
   .then(function(result){
     if(result == 1){
       res.json("Success");
     }else{
       res.json("fail");
     }
   })
   .catch(function(err){
      console.log(err);
   });

});



module.exports = router;
