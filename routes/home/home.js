var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var passport = require('../../join/passport');
var userDao = require('../../query/user/user');
//이메일 관련 파일 require
var mail = require('../../support/email');
//암호화 관련 파일 require
var encode = require("../../support/encode");


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
                if (result) {
                    //쿠키에 있는 유저 정보 중 패스워트 null로 변경
                    req.user.password = null;
                    return res.redirect('/main');
                } else {
                    //첫번째 로그인인경우 비밀번호 변경 페이지로 간다.
                    var id = user.id;
                    return res.redirect('/home/login_first/' + id + "/" + req.params.category);
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
        return res.redirect('/home/login_first/' + req.params.id+"/"+req.params.category);
    } else if (req.body.password.length < 8) {
        req.flash('error', "비밀번호를 8자 이상으로 설정해주세요.");
        return res.redirect('/home/login_first/' + req.params.id+"/"+req.params.category);
    }
    var key = 'secret password crypto';
    /*입력받은 비밀번호를 암호화해서 비교하기위해 암호화*/
    var cipherPass = crypto.createCipher('aes192', key);
    cipherPass.update(req.body.password, 'utf-8', 'base64');
    cipherPass = cipherPass.final('base64');

    //패스워드 업데이트
    userDao.passwordUpdate(req.params.id, cipherPass, function (result) {
        //패스워드 변경 성공
        if (result) {
            req.flash('error', "비밀번호 변경에 성공하였습니다. 다시 로그인 해주세요. ");
            return res.redirect('/home/login/' + req.params.category);
        } else {
            //패스워드 변경 실패
            req.flash('error', "다시 시도해주세요.");
            return res.redirect('/home/login_first/' + req.params.id+"/"+req.params.category);
        }
    });
});

//아이디 패스워드 찾기 : GET
router.get('/ipfind', function (req, res, next) {
    //에러가 있으면 message 로  에러를 보내준다.
    res.render('home/IPfind', {message: req.flash('error')});
});

//아이디 패스워드 찾기 : POST
router.post('/ipfind', function (req, res, next) {
    var login_id = req.body.login_id;
    var email = req.body.email;
    var category_id = req.body.category;

    userDao.GetUser(login_id, category_id, function (result) {

        //아이디가 없는경우
        if (result == null) {
            req.flash('error', "아이디가 없습니다.");
            return res.redirect('/home/ipfind');
        }
        //에러 발생시
        if (!result) {
            req.flash('error', "다시 확인해주세요.");
            return res.redirect('/home/ipfind');
        }

        //성공한 경우
        if (result.email == email) {
            encode.MakeURL(login_id, category_id, function (result) {
                //TODO: 주소 변경하기
                var sendURL = "http://localhost:3000/home/initpass/" + result;
                mail.send("성공회대학교 비밀번호 초기화 이메일 입니다.", email, "클릭하여 비밀번호를 초기화 해주세요 \n" + '<html><a href=' + '"' + sendURL + '"' + 'target="_blank">비밀번호 초기화 페이지</a></html>');
                req.flash('error', "이메일을 확인하여 비밀번호를 초기화 하고 로그인해주세요.");
                return res.redirect('/home/ipfind');
            });
        } else {
            //이메일이 다른 경우
            req.flash('error', "이메일을 확인해주세요.");
            return res.redirect('/home/ipfind');
        }
    });
});


//비밀번호 초기화 : GET
router.get('/initpass/:url', function (req, res, next) {
    //에러가 있으면 message 로  에러를 보내준다.
    res.render('home/init_password', {message: req.flash('error')});
});

//비밀번호 초기화 : POST
router.post('/initpass/:url', function (req, res, next) {


    var url = req.params.url;
    var login_id = req.body.login_id;
    var category_id = req.body.category;

    encode.searchURL(url, login_id, category_id, function (result) {

        //잘못된 url로 접근한경우 홈으로 redirect
        if (result == "error") {
            return res.redirect("/home");
        }

        //성공한 경우
        if (result) {
            userDao.GetBirth(login_id, category_id, function(result){
                /*생년월일의 결과값을 암호화하여 그 값을 비밀번호로 변경*/
                var key = 'secret password crypto';
                var chipherBirth = row[0].birth;
                chipherBirth = chipherBirth.createCipher('aes192', key);
                chipherBirth.update(row[0].birth, 'utf-8', 'base64');
                chipherBirth = chipherBirth.final('base64');
                //비밀번호 생년월일로 초기화
                userDao.ResetPasswordToBirth(login_id, category_id, chipherBirth,function (result) {
                    //TODO: hashmap 삭제
                    //초기화 성공
                    if (result) {
                        encode.removeURL(url);
                        req.flash('error', "초기화된 비밀번호(생년월일)로 로그인해주세요.");
                        return res.redirect('/home/login/' + category_id);
                    }else{
                        //초기화 실패
                        req.flash('error', "아이디를 확인해주세요.");
                        return res.redirect('/home/initpass/' + url);
                    }
                });
            });

        } else {
            //실패한 경우
            req.flash('error', "아이디와 구분을 확인해주세요.");
            return res.redirect('/home/initpass/' + url);
        }
    });
});


module.exports = router;
