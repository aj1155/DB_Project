/**
 * Passport 기능을 사용하여 session기능 구현
 * <pre>
 * input : none
 * output : none
 * Table : none
 * </pre>
 *
 * <pre>
 * <b>History:</b>
 *    김만기, 1.0, 2016.11.04 초기작성
 * </pre>
 *
 * @author 김만기
 * @version 1.0, 2016.11.04 주석 추가
 * @see    None
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var auth = require('./auth');
var userDao = require('../query/user/user');
var crypto = require('crypto');
/*LocalStrategy는 session 정보를 넘겨주는 역활을 한다*/
passport.use(new LocalStrategy({
    usernameField: 'login_id', // 이 부분은 login form에 input tag name과 동일 해야 하며 그 value를 담는 부분이다*/
    passwordField: 'password',
    passReqToCallback: true
}, function (req, login_id, password, done) {
    /*해당 data를 form으로 부터 정상적으로 받았다면  db에서 User를 조회한다*/
    auth.UserAuth(login_id,req.params.category, function (user) {
        var key = 'secret password crypto';
        /*입력받은 비밀번호를 암호화해서 비교하기위해 암호화*/
        var cipherPass = crypto.createCipher('aes192', key);
        cipherPass.update(password, 'utf-8', 'base64');
        cipherPass = cipherPass.final('base64');

        /*암호화된 비밀번호를 원래대로 돌리기 위한 코드*/
        // var dataPass = crypto.createDecipher('aes192', key);
        // dataPass.update(user.password, 'base64', 'utf-8');
        // dataPass = dataPass.final('utf-8');

        if (!user) {
            return done(null, false, req.flash('error', 'ID가 존재하지 않습니다.'));
        }
        if (user.password !== cipherPass) {
            // /*done메소드의 두번째 parameter가 false이면 로그인 실패를 의미하고 세번째 파라미터는 session 에 에러 메시지를 저장한다.*/
            return done(null, false, req.flash('error', '패스워드 틀렸습니다.'));
        }

        /*done(null,user)는 LocalStrategy의 기능이고  serializeUser에 parameter로 user객체를 넘긴다*/
        return done(null, user);
    });
}));

/*로그인이 정상적으로 성공하면 serialize메소드가 실행되고 그 결과 done 메소드는 deserialize로 넘어간다*/
passport.serializeUser(function (user, done) {
    console.log('serialize');
    done(null, user);
});

/*deserialize는 session이 있을경우 매 url 요청마다 실행이 되고 파라미터는 serialize의 done 메소드다)*/
passport.deserializeUser(function (user, done) {
    /* 처음 연결시에는 User정보를 다 가져오는 것보다 인증만 하고 필요한 User 정보는
     deserialize호출시 가져오는 편이 효율적이다*/
    userDao.FindOne(user.id,user.category_id, function (result) {
        //result 에는 유저정보가 저장되어있다. 이 정보는 어떤 url 에서도 req.user 로 접근할수 있다. 그래서 필요없는 정보는 없애고 보내준다.
        result.password = "";
        done(null, result);
    });
});

module.exports = passport;
