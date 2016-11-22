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
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/home');
    }
});

//nav에서 ajax로 호출해서 유저 데이터 및 사진 등 nav를 초기화 하는 데이터를 가져온다.
router.post('/navSet', function (req, res, next) {
    userDao.GetMaxGrade(req.user.category_id,function(grade){
        //에러가 난 경우
        if(!grade){
            return res.redirect('/main');
        }
        userDao.FindProfileImage(req.user.id, function (data) {
            //기본이미지
            var img = "/res/production/images/user.png";
            //이미지 데이터가 있는경우
            if (data) {
                //img를 base64로 인코딩해서 넣어준다.
                img = "data:image/gif;base64," + new Buffer(data.data).toString('base64');
            }

            console.error("grade.maxGrade "+grade.maxGrade)
            return res.send({result: true, name: req.user.name, grade: req.user.grade, profile: img,maxGrade:grade.maxGrade});
        });
    });
});

router.get('/', function (req, res, next) {
    return res.render('main/main', {user : req.user});
});


/* session destroy 후 home으로 redirect*/
router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            console.log('err');
        }
        return res.redirect('/home');
    });
});


module.exports = router;
