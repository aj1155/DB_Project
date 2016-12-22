var mysql = require('mysql');
var pool = require('../../join/connection');

var grademanager={};

grademanager.select=function(user_id,position,category_id,callback){
  pool.getConnection(function(err,connection){
    var query="select * from grademanager where user_id=? and position=? and category_id=?";
    connection.query(query,[user_id,position,category_id],function(err,results){
      if(err){
        console.log(err);
      }else{
        if(results.length!=0){
          callback("success");
        }else{
          callback("fail");
        }
        connection.release();
      }
    });
  });
};
module.exports = grademanager;
