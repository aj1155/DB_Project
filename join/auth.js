/**
 * 접근 권한 및 db 연결 설정을 위한 auth생성
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
 * @version 1.0, 2016.11.06 주석 추가
 * @see    None
 */
var mysql = require('mysql');
var pool = require('./connection'); // 생성 했던 dbPool을 가져온다

/*이 부분은 모바일을 위해 만든 Outh2.0 관련 부분인데 아직은  알 필요 없다 */
var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');
var SECRET = 'token_secret';
var EXPIRES = 60; // 1 hour
var validateJwt = require('express-jwt')({secret: SECRET});

/*해당 비밀 번호의 User 정보를 가져오는 부분*/
function UserAuth(login_id, category_id, callback) {
    pool.getConnection(function (err, connection) {
        if(err){
            console.error("error is " + err);
        }
        connection.query("SELECT id,login_id,password,category_id FROM user where login_id=? && category_id=?", [login_id, category_id], function (err, row) {
            callback(row[0]);
            connection.release();
        });
    });


}

/*Angular2 이용시 토큰 사용*/
// JWT 토큰 생성 함수
function signToken(id) {
    return jwt.sign({id: id}, SECRET, {expiresIn: EXPIRES});
}


// 토큰을 해석하여 유저 정보를 얻는 함수
function isAuthenticated() {
    return compose()
    // Validate jwt
        .use(function (req, res, next) {
            // 만약 access_token 파라메터에 토큰을 설정한 경우 리퀘슽 헤더에 토큰을 설정한다.
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = 'Bearer ' + req.query.access_token;
            }

            // 토큰 인증 로직
            validateJwt(req, res, next);
        })
        // Attach user to request
        .use(function (req, res, next) {
            req.user = {
                id: req.user.id,
                name: 'name of ' + req.user.id
            };
            next();
        });

}


exports.signToken = signToken;
exports.isAuthenticated = isAuthenticated;
exports.UserAuth = UserAuth;
