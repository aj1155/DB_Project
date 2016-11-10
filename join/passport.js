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
/*LocalStrategy는 session 정보를 넘겨주는 역활을 한다*/
passport.use(new LocalStrategy({
    usernameField: 'login_id', // 이 부분은 login form에 input tag name과 동일 해야 하며 그 value를 담는 부분이다*/
    passwordField: 'password',
    passReqToCallback:true
}, function(req,login_id,password,done){
  /*해당 data를 form으로 부터 정상적으로 받았다면  db에서 User를 조회한다*/
    auth.UserAuth(login_id,function(user){
      if(!user){
          return done(null, false);
      }
      if(user.password !== password){
        /*done메소드의 두번째 parameter가 false이면 로그인 실패를 의미하고 err 메시지를 띄운다*/
          return done(null, false);
      }
      /*done(null,user)는 LocalStrategy의 기능이고  serializeUser에 parameter로 user객체를 넘긴다*/
      return done(null, user);
    });
}));

/*로그인이 정상적으로 성공하면 serialize메소드가 실행되고 그 결과 done 메소드는 deserialize로 넘어간다*/
passport.serializeUser(function(user, done){
    console.log('serialize');
    done(null, user.id);
});

/*deserialize는 session이 있을경우 매 url 요청마다 실행이 되고 파라미터는 serialize의 done 메소드다)*/
passport.deserializeUser(function(id,done){
  console.log('deserialize');
   /* 처음 연결시에는 User정보를 다 가져오는 것보다 인증만 하고 필요한 User 정보는
   deserialize호출시 가져오는 편이 효율적이다*/
    userDao.FindOne(id,function(result){
       done(null, result);
    });
});

module.exports = passport;
