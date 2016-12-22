var mysql = require('mysql');
var pool = require('../../join/connection');

var boardAuth={};

boardAuth.selectByBoard_id=function(board_id,callback){
  pool.getConnection(function(err,connection){
    var query = "select * from boardauth where board_id=?";
    connection.query(query,board_id,function(err,result){
      if(err){
        console.log(err);
      }else{
        callback(result[0]);
        connection.release();
      }
    });
  });
};
module.exports = boardAuth;
