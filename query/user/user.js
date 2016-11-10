/**
 * User 쿼리 진행을 위한 query문 생성
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

var mysql=require('mysql');
var pool=require('../../join/connection');

var user={};

user.FindOne = function(id,category_id,callback){
 pool.getConnection(function(err,connection){
   connection.query("select * from user where id=?",[id],function(err, row){
      /* query의 결과가 배열 형태로 오게 되는데
      결과가 1개 일 경우는 [0]을 붙여 주어야 받을 때 undefined 문제가 안생긴다*/

       callback(row[0]);
       connection.release();
   });
 });

};

//첫번째 로그인인지 아닌지 알아내는 함수 (생년월일과 현재 비밀번호 비교)
user.firstLogin = function(id,callback){
    pool.getConnection(function(err,connection){
        connection.query("select password,birth from user where id=?",[id],function(err, row){
            connection.release();
            //현재 비밀번호가 생일과 같을 경우 즉, 비밀번호를 변경하지 않은 경우
            if(row[0].password == row[0].birth){
                callback("false");
            }else {
                //비밀번호를 변경 한 경우
                callback("true");
            }
        });
    });
};

//패스워드 업데이트 쿼리
user.passwordUpdate = function(id,password,callback){
    pool.getConnection(function(err,connection){
        connection.query("update user set password =? where id = ?",[password,id],function(err, row){
            connection.release();
            //패스워드 업데이트 실패
            if(err){
                callback(err);
            } else{
                //패스워드 업데이트 성공
                callback("true")
            }
        });
    });
}
module.exports = user;
