var express = require('express');
var router = express.Router();
var pool = require('../../join/connection');
var userDao = require('../../query/user/user');
var multiparty = require('multiparty');
var multer = require('multer');
var fs = require('fs');
var sequelize = require('../../join/sequelize');
var CategoryManager = require('../../model/CategoryManager');
var gm = require('gm'); /*이미지파일 리사이즈위한 모듈*/
var storage = multer.diskStorage({
  destination:function(req,file,cb){
    var path='../public/profileImage/';
    cb(null,path)
  },
  filename:function(req,file,cb){
    cb(null,req.user.id+'_Profile.jpg')
  }
});

var upload = multer({storage:storage});
var user_requestDAO=require('../../query/user_request/user_request.js');
var crypto = require('crypto');


/*session user정보를 local에 저장하여 ejs파일로
명시적으로 넘겨주지않아도 자동적으로 넘어감 세션값 사용시 user로 꺼내쓰면됨*/
router.use(function(req, res, next) {
  if(req.user) res.locals.user = req.user;
  else res.locals.user = undefined;
  next();
});

/* GET users listing. */
router.get('/contacts', function(req, res, next) {
  sequelize.authenticate().then(function(err){
    CategoryManager.findAll({
      where : {
        category_id : req.user.category_id
      }
    })
    .then(function(rows){
      res.render('user/contacts',{userList:rows,msg:"",type:""});
    });

  })
  .catch(function(err){
    res.send(err);
  });
});

router.get('/profile',function(req,res,next){
  userDao.FindGrade(req.user.id, req.user.category_id, function(result){
    res.render('users/profile', {user : req.user, grade : result});
  });
});

router.get('/userGradeList/:category_id/:grade', function(req, res, next) {
  var grade = req.params.grade;
  var category_id = req.params.category_id;
  var srchType = req.query.srchType;
  var srchText = req.query.srchText;
  if(req.query.srchType==null) srchType = 0;
  var count = 4;
  var param=[
    srchType,srchText,category_id,grade,0,count
  ];
    userDao.selectOptions(param,function(result){
      res.render('user/userGradeList', {user : req.user, grade : grade, userList : result[0],srchType:srchType,srchText:srchText});
    });
});
/*user 검색 목록 더보기 */
router.get('/userGradeListMore/:category_id/:grade',function(req,res,next){
  var grade = req.params.grade;
  var category_id = req.params.category_id;
  var srchType = req.query.srchType;
  var srchText = req.query.srchText;
  var current = Number(req.query.current)+1;
  if(req.query.srchType==null) srchType = 0;
  var count = 3;
  var param=[
    srchType,srchText,category_id,grade,current,count
  ];
  userDao.selectOptions(param,function(result){
    var data={};
    console.log(result);
    if(result[0].length>0){
      data ={
        len : result[0].length,
        list : result[0],
        msg : "success"
      };
    }else{
      data = {
        msg : "noData"
      }
    }
    res.json(data);
  });
});
/*user manager 검색 목록 더보기 */
router.get('/userManagerListMore/:category_id/:grade',function(req,res,next){
  var grade = req.params.grade;
  var category_id = req.params.category_id;
  var srchType = req.query.srchType;
  var srchText = req.query.srchText;
  var current = Number(req.query.current)+1;
  if(req.query.srchType==null) srchType = 0;
  var count = 3;
  var param=[
    srchType,srchText,category_id,grade,current,count
  ];
  userDao.selectManagerOptions(param,function(result){
    var data={};
    if(result[0].length>0){
      data ={
        len : result[0].length,
        list : result[0],
        msg : "success"
      };
    }else{
      data = {
        msg : "noData"
      }
    }

    res.json(data);
  });
});


/*userManagerList*/
router.get('/userManagerList/:category_id/:grade', function(req, res, next) {
  var grade = req.params.grade;
  var category_id = req.params.category_id;
  var srchType = req.query.srchType;
  var srchText = req.query.srchText;
  if(req.query.srchType==null) srchType = 0;
  var count = 4;
  var param=[
    srchType,srchText,category_id,grade,0,count
  ];
    userDao.selectManagerOptions(param,function(result){
      res.render('user/userManagerList', {user : req.user, grade : grade, userList : result[0],srchType:srchType,srchText:srchText});
    });
});
//마이페이지 회원정보수정
router.get('/edit',function(req,res,next){
  userDao.FindGrade(req.user.id, req.user.category_id, function(result){
      userDao.SelectUserInfo(req.user.id,function(rows){
        fs.stat('../public/profileImage/'+req.user.id+'_Profile.jpg',function(err,data){
            var not_exist;
            if(err) not_exist=err;
            res.render('user/edit',{ user:req.user, message:req.flash('error'), grade:result, profileImg:not_exist });
        });
      });
    });
  });


router.post('/edit',function(req,res,next){
  if (req.body.passwd != req.body.passwdCheck) {
      req.flash('error', "비밀번호와 비밀번호확인이 일치하지 않습니다.");
      return res.redirect('/users/edit');
  } else if (req.body.passwd.length < 8) {
      req.flash('error', "비밀번호를 8자 이상으로 설정해주세요.");
      return res.redirect('/users/edit');
  }

  var key = 'secret password crypto';
  var myPass = req.body.passwd;/*암호화 전에 패스워드*/

  var cipherPass = crypto.createCipher('aes192', key);
  cipherPass.update(myPass, 'utf8', 'base64');
  cipherPass = cipherPass.final('base64'); /*암호화 후에 패스워드*/

  var param = [cipherPass,req.body.iCheck0,req.body.social_status,req.body.iCheck1,req.body.phone_number,req.body.iCheck2,req.body.company_number,req.body.iCheck3,req.body.email,req.body.iCheck4,req.user.id];
  userDao.UpdateUserInfo(param,function(result){
    if(result){
      userDao.SelectUserInfo(req.user.id,function(loginId){
        if(loginId.login_id!=req.body.phone_number){
          var d = new Date();
          var date = (d.getFullYear()) + '-' +
              (d.getMonth() + 1) + '-' +
              (d.getDate()) + ' ';
              var phone=loginId.phone_number.split('-');
              var loginId2=phone[0]+phone[1]+phone[2];
              console.log(req.user.login_id);
              console.log(loginId2);

          user_requestDAO.insert(req.user.id,req.user.category_id,req.user.name,date,req.user.login_id,loginId2,function(q){
            req.flash('error',"개인정보가 변경되었습니다.");
            return res.redirect('/users/edit');
          })
        }
      })
    }else{
      req.flash('error',"변경 실패, 다시 시도해주세요.");
      return res.redirect('/users/edit');
    }
  });
});

router.post('/profile',upload.any(),function(req,res,next){
  userDao.UpdateIsimg(req.user.id,function(result){
    if(result){
      gm('../public/profileImage/'+req.user.id+'_Profile.jpg')
      .resize(200,200,'!')
      .write('../public/profileImage/'+req.user.id+'_Profile.jpg',function(err){
        if(!err){
          console.log('done-resize image');
          return res.redirect('/users/edit');
        }
      });
      //return res.redirect('/users/edit');
    }
  });
  // console.log('../public/profileImage/'+req.user.id+'_Profile.jpg');
  // gm('../public/profileImage/'+req.user.id+'_Profile.jpg')
  //   .resize('200', '200', '^');
});



router.get('/detailProfile/:id', function(req, res, next) {
  var id = req.params.id;
  userDao.FindOne(id, req.user.category_id, function(result) {
    fs.exists('../public/profileImage/'+req.params.id+'_Profile.jpg', function(exists){       // 파일 존재 여부 확인
      if(exists){
          res.render('user/detailProfile',{ message:req.flash('error'), profileImg:true, userImformation : result });
      } else {
          res.render('user/detailProfile',{ message:req.flash('error'), profileImg:false, userImformation : result });
      }
    });
  });
});

router.get('/detailContactsProfile/:id', function(req, res, next) {
  var id = req.params.id;
  userDao.FindOne(id, req.user.category_id, function(result) {
    fs.exists('../public/profileImage/'+req.params.id+'_Profile.jpg', function(exists){       // 파일 존재 여부 확인
      if(exists){
          res.render('user/detailContactsProfile',{ message:req.flash('error'), profileImg:true, userImformation : result });
      } else {
          res.render('user/detailContactsProfile',{ message:req.flash('error'), profileImg:false, userImformation : result });
      }
    });
  });
});

router.get('/detailManagerProfile/:id', function(req, res, next) {
  var id = req.params.id;
  userDao.FindOne(id, req.user.category_id, function(result) {
    fs.exists('../public/profileImage/'+req.params.id+'_Profile.jpg', function(exists){       // 파일 존재 여부 확인
      if(exists){
          res.render('user/detailManagerProfile',{ message:req.flash('error'), profileImg:true, userImformation : result });
      } else {
          res.render('user/detailManagerProfile',{ message:req.flash('error'), profileImg:false, userImformation : result });
      }
    });
  });
});

module.exports = router;
