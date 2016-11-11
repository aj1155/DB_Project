var express = require('express');
var router = express.Router();
var passport = require('../../join/passport');
var userDao = require('../../query/user/user');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home/main');
});
/* get 으로 로그인 페이지에 들어온경우*/
router.get('/login/:category', function (req, res, next) {
    //에러가 있으면 message 로  에러를 보내준다.
    res.render('home/login', {message: req.flash('error')});
});

/* POST action으로 들어온 인증처리를 /login에서 하도록 하고 passport.authenticate를 ‘local’로 한다. 내부 함수에서 에러가 있는 경우 다시 로그인 화면으로 redirect 한다*/
router.post('/login/:category', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {

        //error 인경우
        if (err) {
            return res.redirect(req.params.category);
        }
        //유저 객체가 없는경우
        if (!user) {
            return res.redirect(req.params.category);
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.redirect(req.params.category);
            }
            //로그인이 정상적으로 완료 된 경우

            //첫번째 로그인인지 확인한다.
            userDao.firstLogin(user.id, function (result) {

                //첫번째 로그인이 아닌경우 main 화면으로 간다.
                if (result == "true") {
                    return res.redirect('/main');
                } else {
                    //첫번째 로그인인경우 비밀번호 변경 페이지로 간다.
                    var id = user.id;
                    return res.redirect('/home/login_first/' + id+"/"+req.params.category);
                }
            });
        });
    })(req, res, next);
});

//첫번째 로그인시 GET : 리스트 가져옴
router.get('/login_first/:id/:category', function (req, res, next) {

    // 로그인한 상태가 아니면 redirect 한다
    if (!req.isAuthenticated()) {
        return res.redirect('/home');
    }

    //보안을 위해 유저정보와 현재 로그인한 아이디가 같은지 검사하고 다르면 home 으로 리다이렉트한다.
    if (req.params.id != req.user.id) {
        return res.redirect('/home');
    }

    //에러메시지를 가져온다.
    var msg = req.flash('error');
    res.render('home/login_first', {message: msg});
});

//첫번째 로그인시 POST : 비밀번호 변경
router.post('/login_first/:id/:category', function (req, res, next) {

    //비밀번호와 비밀번호 체크가 다른경우
    if (req.body.password != req.body.password_confirm) {
        req.flash('error', "비밀번호와 비밀번호 확인이 다릅니다");
        return res.redirect('/home/login_first/' + req.params.id);
    }else if(req.body.password.length < 8){
        req.flash('error', "비밀번호를 8자 이상으로 설정해주세요.");
        return res.redirect('/home/login_first/' + req.params.id);
    }

    //패스워드 업데이트
    userDao.passwordUpdate(req.params.id,req.body.password,function(result){
        //패스워드 변경 성공
        if(result == "true"){
            req.flash('error', "비밀번호 변경에 성공하였습니다. 다시 로그인 해주세요. ");
            return res.redirect('/home/login/'+req.params.category);
        }else{
            //패스워드 변경 실패
            req.flash('error', "다시 시도해주세요.");
            return res.redirect('/home/login_first/' + req.params.id);
        }
    });
});

router.get('/ipfind', function (req, res, next) {
    res.render('home/IPfind');
});


module.exports = router;
