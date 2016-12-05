var express = require('express');
var router = express.Router();
var userDao = require('../../query/user/user');
var fs = require('fs');

/*
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

/*session user정보를 local에 저장하여 명시적으로 넘겨주지않아도
 ejs파일로 render할 시에 자동적으로 넘어감 세션값 사용시 user로 꺼내쓰면됨*/
router.use(function (req, res, next) {
    if (req.user) res.locals.user = req.user;
    else res.locals.user = undefined;
    next();
});

//nav에서 ajax로 호출해서 유저 데이터 및 사진 등 nav를 초기화 하는 데이터를 가져온다.
router.post('/navSet', function (req, res, next) {
    userDao.GetMaxGrade(req.user.category_id, function (grade) {
        //에러가 난 경우
        if (!grade) {
            return res.redirect('/main');
        }
        //기본이미지

        //이미지 데이터가 있는경우

        var path = __dirname+"/../../public/profileImage/"+req.user.id+"_Profile.jpg";
        fs.stat(path, function (err, stats) {
            var img = "/res/production/images/user.png";;
            if(!err){
                img = "/profileImage/"+req.user.id+"_Profile.jpg";
            }

            return res.send({
                result: true,
                name: req.user.name,
                grade: req.user.grade,
                profile: img,
                maxGrade: grade.maxGrade,
                is_admin: req.user.is_admin
            });
        });
    });
});

router.get('/', function (req, res, next) {
    return res.render('main/main');
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
