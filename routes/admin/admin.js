var express = require('express');
var router = express.Router();
var User = require('../../model/User');
var userDao = require('../../query/user/user');
var Introduce = require('../../model/Introduce');
var sequelize = require('../../join/sequelize'); /* node.js orm sequelize 설정을 불러옴 */
var multer = require('multer'); /*mutipart/form-data 처리를 위한 미들웨어*/
var exUd = require('../../services/excelUpload');
var exTJ = require('../../services/excelToJson');
var addRows = require('../../services/addRows');
var crypto = require('crypto');



/*session user정보를 local에 저장하여 ejs파일로
명시적으로 넘겨주지않아도 자동적으로 넘어감 세션값 사용시 user로 꺼내쓰면됨*/
router.use(function(req, res, next) {
  if(req.user) res.locals.user = req.user;
  else res.locals.user = undefined;
  next();
});

//관리자인 경우만 이 페이지를 들어올수 있게함
router.use('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        if(req.user.is_admin == 0){
            return res.redirect('/main');
        }
        return next();
    } else {
        return res.redirect('/main');
    }
});

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
    User.findAll({
      where : {
        category_id : req.user.category_id
      },
      limit: 10
    })
    .then(function(rows){
      res.render('admin/userManage',{userList:rows,msg:"",type:""});
    });

  })
  .catch(function(err){
    res.send(err);
  });
});
router.get('/userManage/:msg', function(req, res ,next) {
  var msg="";
  console.log(req.params.msg);
  if(req.params.msg=='delfine'){
    msg = "회원을 정상적으로 탈퇴 처리 했습니다."
  }

  sequelize.authenticate().then(function(err){
    User.findAll({
      where : {
        category_id : req.user.category_id
      },
      limit: 10
    })
    .then(function(rows){
      res.render('admin/userManage',{userList:rows,msg:msg,type:""});
    });

  })
  .catch(function(err){
    res.send(err);
  });
});

router.get('/userEdit/:id', function(req, res, next) {
  var id = req.params.id;
  userDao.FindOne(id, req.user.category_id, function(rows){
    res.render('admin/userEdit', {edit : rows, message : req.flash('error')});
  });
});

router.post('/userEdit/:id', function(req, res, next) {
  var id = req.params.id;

  var params = [req.body.login_id, req.body.name, req.body.grade, req.body.social_status, req.body.phone_number, req.body.company_number, req.body.email, req.body.birth, id];
  console.log('params length : ' + params.length);
  console.log(params[1]);
  for(var i=0; i<params.length; i++) {
    if(params[i] === null || params[i] === '') {
      req.flash('error', "변경실패, 빈 값이 있습니다.");
      return res.redirect('/admin/userEdit/'+id);
    }
  }
  userDao.updateOne(params,function(result){
    if(result){
      req.flash('error',"개인정보가 변경되었습니다.");
      return res.redirect('/admin/userEdit/'+id);
    }else{
      req.flash('error',"변경 실패, 다시 시도해주세요.");
      return res.redirect('/admin/userEdit/'+id);
    }
  });
});


/*User삽입*/
router.post('/user',function(req,res,next){
  var key = 'secret password crypto';
  var myPass = req.body.birth;/*암호화 전에 패스워드*/

  var cipherPass = crypto.createCipher('aes192', key);
  cipherPass.update(myPass, 'utf8', 'base64');
  cipherPass = cipherPass.final('base64'); /*암호화 후에 패스워드*/
  User.create({
    login_id : req.body.login_id,
    name : req.body.name,
    password : cipherPass,
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
      res.render('admin/userManage',{userList:rows, msg:"정상적으로 회원가입을 하였습니다.",type:"success"});
    });
  });
});

/* Excel 다중 User 처리*/
router.post('/userExcel',function(req,res){
  var exceltojson;
  var list;
  User.findAll({
    where : {
      category_id : req.user.category_id
    }
  })
  .then(function(rows){
    list = rows;
    exUd.upload(req,res,function(err){
      if(err){
             res.render('admin/userManage',{userList:list, msg:req.flash('error'),type:"error"});
             return;
        }
        /** Multer gives us file info in req.file object */
        if(!req.file){
            req.flash('error', "실패 : 업로드 파일이 없습니다!");
            res.render('admin/userManage',{userList:list, msg:req.flash('error'),type:"error"});
            return;
        }

        exTJ.exToJson(req,function(result){
          if(result == 'fail'){
            res.render('admin/userManage',{userList:list, msg:req.flash('error'),type:"error"});
          }
          else{
            addRows.insert(result,req.user.category_id,function(msg){
                if(msg == "success"){
                  User.findAll({
                    where : {
                      category_id : req.user.category_id
                    }
                  })
                  .then(function(result){
                    res.render('admin/userManage',{userList:result, msg:"사용자 엑셀 추가 성공했습니다.",type:"success"});
                  });

                }
            });
            //res.render('admin/userManage',{list : result});
          }
        });

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
