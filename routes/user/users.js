var express = require('express');
var router = express.Router();
var pool = require('../../join/connection');
var userDao = require('../../query/user/user');

/* GET users listing. */
router.get('/contacts', function(req, res, next) {
  res.render('user/contacts');
});
router.get('/profile',function(req,res,next){
  res.render('user/profile');
});

//마이페이지 회원정보수정
router.get('/edit',function(req,res,next){
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
