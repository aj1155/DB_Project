var express = require('express');
var router = express.Router();
var pool = require('../../join/connection');
var userDao = require('../../query/user/user');

/*session user정보를 local에 저장하여 ejs파일로
명시적으로 넘겨주지않아도 자동적으로 넘어감 세션값 사용시 user로 꺼내쓰면됨*/
router.use(function(req, res, next) {
  if(req.user) res.locals.user = req.user;
  else res.locals.user = undefined;
  next();
});

/* GET users listing. */
router.get('/contacts', function(req, res, next) {
  userDao.FindGrade(req.user.id, req.user.category_id, function(result){
    res.render('user/contacts', {user : req.user, grade : result});
  });
  /* res.render('user/contacts');*/
});
router.get('/profile',function(req,res,next){
  userDao.FindGrade(req.user.id, req.user.category_id, function(result){
    res.render('user/profile', {user : req.user, grade : result});
  });
  /* res.render('user/profile');*/
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
    var data ={
      len : result[0].length,
      list : result[0],
      msg : "success"
    };
    res.json(data);
  });
});
//마이페이지 회원정보수정
router.get('/edit',function(req,res,next){
  userDao.FindGrade(req.user.id, req.user.category_id, function(result){
    res.render('user/edit', {user : req.user, grade : result});
  });
  /* res.render('user/edit');*/
  userDao.SelectUserInfo(req.user.id,function(rows){
    res.render('user/edit',{ user:rows, message:req.flash('error') });
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

  var param = [req.body.passwd,req.body.social_status,req.body.iCheck1,req.body.phone_number,req.body.iCheck2,req.body.company_number,req.body.iCheck3,req.body.email,req.body.iCheck4,req.user.id];
  userDao.UpdateUserInfo(param,function(result){
    if(result){
      req.flash('error',"개인정보가 변경되었습니다.");
      return res.redirect('/users/edit');
    }else{
      req.flash('error',"변경 실패, 다시 시도해주세요.");
      return res.redirect('/users/edit');
    }
  });
});

module.exports = router;
