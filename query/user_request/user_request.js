var mysql = require('mysql');
var pool = require('../../join/connection');

var user_request={};

user_request.select=function(category_id,callback){
  var query="SELECT * FROM user_request WHERE category_id=?";
  pool.getConnection(function(err,connection){
    connection.query(query,category_id,function(err,result){
      if(err){
        console.log(err);
      }else{
        callback(result);
        connection.release();
      }
    });
  });
};

user_request.insert=function(id,category_id,user_name,insert_time,loginId,loginId2,callback){
  var query="INSERT INTO user_request(user_id,category_id,user_name,request_time,loginId,loginId2) VALUES(?,?,?,?,?,?)";
  pool.getConnection(function(err,connection){
    connection.query(query,[id,category_id,user_name,insert_time,loginId,loginId2],function(err,result){
      if(err){
        console.log(err);
      }else{
        callback(result);
        connection.release();
      }
    });
  });
};

user_request.delete=function(user_id,callback){
  var query="DELETE FROM user_request where user_id=?";
  pool.getConnection(function(err,connection){
    connection.query(query,user_id,function(err,result){
      if(err){
        console.log(err);
      }else{
        callback(result);
        connection.release();
      }
    });
  });
};

user_request.select_one=function(user_id,callback){
  var query="SELECT * FROM user_request where user_id=?";
  pool.getConnection(function(err,connection){
    connection.query(query,user_id,function(err,results){
      if(err){
        console.log(err);
      }else{
        callback(results);
        connection.release();
      }
    });
  });
};
module.exports = user_request;
