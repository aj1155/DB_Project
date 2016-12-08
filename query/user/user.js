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
var crypto = require('crypto');

var user = {};

//카테고리명
user.GetCategoryName = function(id,callback){
  pool.getConnection(function(err,connection){
    connection.query("SELECT c.name FROM user u LEFT JOIN category c ON u.category_id = c.id WHERE u.id=?",[id],function(err,row){
      connection.release();
      callback(row[0]);
    });
  });
};

/**/
user.SelectUserGrade = function(category_id, grade, callback) {
  pool.getConnection(function(err, connection) {
    connection.query("select * from user where category_id=? and grade=? limit 4",[category_id, grade],function(err, rows) {
      connection.release();
      callback(rows);
    });
  });
};

/*카테고리 임원 수정 쿼리문*/
user.CategoryManagerUpdate = function(params, callback) {
  pool.getConnection(function(err, connection) {
    connection.query("update categorymanager set position=? where user_id = ?", params, function(err, result){
      connection.release();
      if(err) {
        callback(false);
      }
      else {
        callback(true);
      }
    });
  });
};
/*기수별 임원 수정 쿼리문*/
user.GradeManagerUpdate = function(params, callback) {
  pool.getConnection(function(err, connection) {
    connection.query("update grademanager set position=? where user_id = ?", params, function(err, result) {
      connection.release();
      if(err) {
        callback(false);
      }
      else {
        callback(true);
      }
    });
  });
};

/*기수별 임원 추가 쿼리*/
user.GradeManagerInsert = function(params, callback) {
  pool.getConnection(function(err, connection) {
    connection.query("insert into grademanager(category_id, grade, user_id, user_name, position) values (?,?,?,?,?)", params, function(err, row) {
        connection.release();
        callback(true);
    });
  });
};

/*최고경영 임원 추가 쿼리*/
user.CategoryManagerInsert = function(params, callback) {
  pool.getConnection(function(err, connection) {
    connection.query("insert into categorymanager(category_id, user_id, position) values (?,?,?)", params, function(err, row) {
        connection.release();
        callback(true);
    });
  });
};

/*기수별 임원명단 전체 쿼리*/
user.FindAllGradeManager = function(category_id, callback) {
  pool.getConnection(function(err, connection) {
    connection.query("select * from user join grademanager on user.id = grademanager.user_id where grademanager.category_id=? order by grademanager.grade",[category_id],function(err, rows) {
      connection.release();
      callback(rows);
    });
  });
};

/*카테고리 임원명단 전체 쿼리*/
user.FindAllCategoryManager = function(category_id, callback) {
  pool.getConnection(function(err, connection) {
    connection.query("select * from user join categorymanager on user.id = categorymanager.user_id where categorymanager.category_id = ?",[category_id],function(err, rows) {
      connection.release();
      callback(rows);
    });
  });
};

/*기수별임원명단에 해당 회원이 있는지 검색하는 쿼리문*/
user.FindgradeManager = function(user_id, callback) {
  pool.getConnection(function(err, connection) {
    connection.query("select * from grademanager where user_id=?",[user_id], function(err, row) {
      connection.release();
      if(err) {
        callback(false);
      }
      else {
        callback(row[0]);
      }
    });
  });
};
/*해당카테고리의 임원 명단에 해당 회원이 있는지 검색하는 쿼리문*/
user.FindcategoryManager = function(user_id, callback) {
  pool.getConnection(function(err, connection) {
    connection.query("select * from categorymanager where user_id=?",[user_id], function(err, row) {
      connection.release();
      if(err) {
        callback(false);
      }
      else {
        callback(row[0]);
      }
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
             connection.release();
             callback(row[0]);

        });
    });

};

user.updateOne = function(params, callback) {
  pool.getConnection(function(err,connection){
    connection.query("update user set login_id=?, name=?, grade=?, social_status=?, phone_number=?, company_number=?, email=?, birth=? where id = ?",params,function(err,result){
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
            var key = 'secret password crypto';
            /*birth를 암호화해서 비밀번호와 비교하기위해 birth암호화*/
            var cipherBirth = crypto.createCipher('aes192', key);
            cipherBirth.update(row[0].birth, 'utf-8', 'base64');
            cipherBirth = cipherBirth.final('base64');

            /*현재 비밀번호가 생일과 같을 경우 즉, 비밀번호를 변경하지 않은 경우*/
            if (row[0].password == cipherBirth) {
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
            } else{
                //패스워드 업데이트 성공
                callback(true);
              }
        });
    });
};

//로그인 아이디와 카테고리 아이디를 통해 유저 정보를 가져온다.
user.GetUser = function (login_id, category_id, callback) {
    pool.getConnection(function (err, connection) {
      console.error('err' +err);
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

user.ResetPasswordToBirth = function(login_id, category_id, birth, callback) {
  pool.getConnection(function(err, connection) {
      connection.query('update user set password = ? where login_id = ? && category_id = ? ', [birth, login_id, category_id], function(err, row) {
        connection.release();
        if(err) {
          callback(false);
        }
        else {
          callback(true);
        }
      });
  });
};
/*비밀번호를 생년월일로 초기화 하기 위해 생년월일을 뽑아내는 쿼리*/
user.GetBirth = function (login_id, category_id, callback) {
  pool.getConnection(function (err, connection) {
      connection.query('select birth from user where login_id=? && category_id=?;', [login_id, category_id], function(err, row) {
        connection.release();
        if(err) {
          callback(false);
        }
        else {
          callback(row[0]);
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

//프로필사진 저장
user.SetProfileImg = function(id,size,data,callback){
  pool.getConnection(function(err,connection){
    connection.query("SELECT * FROM image WHERE id=?",[id],function(err,row){
      if(err){
        callback(false);
      }else if(row[0]){
        connection.query("UPDATE image SET size=?, data=? WHERE id=?",[size,data,id],function(err,row){
          connection.release();
          if(err){
            callback(false);
          }else {
            callback(true);
          }
        });
      }else{
        connection.query("INSERT INTO image(id,size,data) VALUES(?,?,?)",[id,size,data],function(err,row){
          connection.release();
          if(err){
            callback(false);
          }else {
            callback(true);
          }
        });
      }
    });
  });
};


//회원정보 가져오기
user.SelectUserInfo = function (id, callback) {
    pool.getConnection(function (err, connection) {
        connection.query("SELECT * FROM user WHERE id=?", [id], function (err, row) {
            connection.release();
            if (err) {
                console.log("err");
                console.err(err);
            } else {
                callback(row[0]);
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
/*user manager search Procedure*/
user.selectManagerOptions = function(param,callback){
  pool.getConnection(function(err,connection){
    var query = "CALL user_manager_search(?,?,?,?,?,?)";
    connection.query(query,param,function(err,row){
        connection.release();
        callback(row);
    });
  });
};
/*user list search Procedure*/
user.selectAllOptions = function(param,callback){
  pool.getConnection(function(err,connection){
    var query = "CALL user_list_search(?,?,?,?,?)";
    connection.query(query,param,function(err,row){
        connection.release();
        callback(row);
    });
  });
};
module.exports = user;
