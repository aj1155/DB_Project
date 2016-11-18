var express = require('express');
var router = express.Router();
var userDao = require('../../query/user/user');

/*
TODO : nav.ejs를 미들웨어로 설치하기, nav.ejs에서 이미지 태그에 데이터 넣기
 req.user 정보 :
 {"id":2,"login_id":"01021248619","name":"강준구","password":"","phone_number":"1021248619","company_number":"0","email":"jungu942@naver.com","category_id":1,"grade":3,"social_status":"학생","is_admin":0,"is_phone_number":0,"is_social_status":0,"is_company_number":0,"is_email":0,"is_image":0,"birth":"931104"}
 */

/* GET home page. */
router.use('/', function (req, res, next) {
    //로그인 되어있는 경우만 이 페이지에 접근 가능하게 미들웨어 설정
    if(req.isAuthenticated()){
        next();
    }else{
        console.error("false");
        return res.redirect('/home');
    }
});
router.get('/', function (req, res, next) {
    userDao.FindGrade(req.user.id, req.user.category_id, function (result2) {
        userDao.FindProfileImage(req.user.id, function (data) {
            if (!data) {
                return res.redirect('/home/login/' + req.user.category_id);
            }
            //img를 base64로 인코딩해서 넣어준다.
            var img = new Buffer(data.data).toString('base64')
            console.error("img is"+img);
            return res.render('main/main', {user: req.user, grade: result2, profile: img});
        });
    });

});


/* session destroy 후 home으로 redirect*/
router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            console.log('err');
        }
        res.redirect('/home');
    });
});

module.exports = router;
