var mysql = require('mysql');
var pool = require('../../join/connection');

var board={};

board.selectAll=function(callback){
  pool.getConnection(function(err,connection){
    connection.query("select *,@SEQ := @SEQ+1 AS SEQ from board_post bp join board b on bp.board_id=b.id,(SELECT @SEQ:=0)A",function(err,row){
      if(err){
        console.log(err);
      }else{
        callback(row);
        connection.release();
      }
    });
  });
};

board.selectById=function(id,callback){
  pool.getConnection(function(err,connection){
    connection.query("select * from board_post where id=?",[id],function(err,row){
      if(err){
        console.log(err);
      }else{
        callback(row[0]);
        connection.release();
      }
    });
  });
};
/*
board.board_insert=function(title,content,callback){
  pool.getConnection(function(err,connection){
    var board_id=1;
    var create_time='20161114';
    var user_name='일준';
    var user_id='01093481037';
    connection.query("insert board_post(board_id,title,content,create_time,user_name,user_id,parent_id) values(?,?,?,?,?,?,?)",[board_id,title,content,create_time,user_name,user_id,board_id],function(err,row){
      if(err){
        console.log(err);
        connection.release();
      }else{
        callback(true);
        connection.release();
      }
    });
  });
};
*/
module.exports = board;
