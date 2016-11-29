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

var mysql = require('mysql');
var pool = require('../../join/connection');

var user = {};
/**/
user.SelectUserGrade = function(category_id, grade, callback) {
  pool.getConnection(function(err, connection) {
    connection.query("select * from user where category_id=? and grade=? limit 4",[category_id, grade],function(err, rows) {
      connection.release();
      callback(rows);
    });
  });
};

/*profile사진이 있는지 검색하는 쿼리문*/
user.FindProfileImage = function (id, callback) {

    pool.getConnection(function (err, connection) {
        connection.query("select data from image where id=?;", [id], function (err, row) {
            connection.release();
            if (err) {
                callback(false);
            }
            callback(row[0]);
        });
    });
};

//메뉴에서 있는 기수만 목록에 띄어주기위한 쿼리문
user.FindGrade = function (id, category_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query("select distinct grade from user where category_id=? order by grade asc", [category_id], function (err, row) {
            connection.release();
            callback(row);
        });
    });

};


user.FindOne = function (id, category_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query("select * from user where id=?", [id], function (err, row) {
            /* query의 결과가 배열 형태로 오게 되는데
             결과가 1개 일 경우는 [0]을 붙여 주어야 받을 때 undefined 문제가 안생긴다*/

            callback(row[0]);
            connection.release();
        });
    });

};

user.updateOne = function(params, callback) {
  console.log('1111111111111111'+params);
  pool.getConnection(function(err,connection){
    connection.query("update user set login_id=?, name=?, grade=?, password=?, social_status=?, phone_number=?, company_number=?, email=?, birth=? where id = ?",params,function(err,result){
      connection.release();
      if(err) {
        callback(err);
      }
      else {
        callback(true);
      }
    });
  });
};

//첫번째 로그인인지 아닌지 알아내는 함수 (생년월일과 현재 비밀번호 비교)
user.firstLogin = function (id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query("select password,birth from user where id=?", [id], function (err, row) {
            connection.release();
            //현재 비밀번호가 생일과 같을 경우 즉, 비밀번호를 변경하지 않은 경우
            if (row[0].password == row[0].birth) {
                callback(false);
            } else {
                //비밀번호를 변경 한 경우
                callback(true);
            }
        });
    });
};

//패스워드 업데이트 쿼리
user.passwordUpdate = function (id, password, callback) {
    pool.getConnection(function (err, connection) {
        connection.query("update user set password =? where id = ?", [password, id], function (err, row) {
            connection.release();
            //패스워드 업데이트 실패
            if (err) {
                callback(err);
            } else {
                //패스워드 업데이트 성공
                callback(true);
            }
        });
    });
};

//로그인 아이디와 카테고리 아이디를 통해 유저 정보를 가져온다.
user.GetUser = function (login_id, category_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query("select email from user where login_id=? && category_id = ? ", [login_id, category_id], function (err, row) {
            connection.release();
            //에러가 난 경우
            if (err) {
                callback(false);
            } else {
                //에러가 아닌 경우 유저정보 리턴
                callback(row[0]);
            }
        });
    });
};

//패스워드를 자신의 생년월일로 초기화
user.ResetPassword = function (login_id, category_id, callback) {
    // update user set password = (select * from (SELECT birth from user where login_id="01021248619" && category_id=1) as a)where login_id="01021248619" && category_id=1;
    pool.getConnection(function (err, connection) {
        connection.query('update user set password = (select * from (SELECT birth from user where login_id=? && category_id=?) as a)where login_id=? && category_id=?;', [login_id, category_id, login_id, category_id], function (err, row) {
            connection.release();
            //에러가 난 경우
            if (err) {
                callback(false);
            } else {
                //에러가 아닌 경우
                callback(true);
            }
        });
    });
};

//제일 큰 기수를 가져온다
user.GetMaxGrade = function (category_id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query('select max(grade) as maxGrade from user where category_id = ?;', [category_id], function (err, row) {
            connection.release();
            //에러가 난 경우
            if (err) {
                callback(false);
            } else {
                //에러가 아닌 경우
                callback(row[0]);
            }
        });
    });
};

//회원정보 가져오기
user.SelectUserInfo = function (id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query("SELECT * FROM user WHERE id=?", [id], function (err, row) {
            if (err) {
                console.log("err")
                console.err(err);
            } else {
                callback(row[0]);
                connection.release();
            }
        });
    });
};

//회원정보 수정
user.UpdateUserInfo = function (param, callback) {
    pool.getConnection(function (err, connection) {
        var query = "UPDATE user SET password=?,social_status=?,is_social_status=?,phone_number=?,is_phone_number=?,company_number=?,is_company_number=?,email=?,is_email=? WHERE id=?";
        // [password,social_status,is_social_status,phone_number,is_phone_number,company_number,is_company_number,email,is_email,id];
        connection.query(query, param, function (err, row) {
            connection.release();
            if (err) {
                callback(err);
            } else {
                callback(true);
            }
        });
    });
};
/*user search Procedure*/
user.selectOptions = function(param,callback){
  pool.getConnection(function(err,connection){
    var query = "CALL user_search(?,?,?,?,?,?)";
    connection.query(query,param,function(err,row){
        connection.release();
        callback(row);
    });
  });
};
module.exports = user;
