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

user.FindOne = function(id,callback){
 pool.getConnection(function(err,connection){
   connection.query("select * from user where id=?",[id],function(err, row){
      /* query의 결과가 배열 형태로 오게 되는데
      결과가 1개 일 경우는 [0]을 붙여 주어야 받을 때 undefined 문제가 안생긴다*/

       callback(row[0]);
       connection.release();
   });
 });

};


module.exports = user;
