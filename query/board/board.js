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

board.board_insert=function(title,content,callback){
  pool.getConnection(function(err,connection){
    connection.query("insert into board_post(board_id,title,content,create_time,user_name,user_id) values(?,?,?,?,?,?)",[1,title,content,bp[1],bp[2],bp[3]],function(err,row){
      if(err){/*insert set-->json객체를 넣고 객체를 매개변수로*/
        console.log(err);
      }else{
        callback(true);
        connection.release();
      }
    });
  });
};

board.selectByCategory_id=function(category_id,callback){
  var query = "select bp.* from board_post bp JOIN board b ON b.id=bp.board_id && b.category_id=? && b.id=?";
  pool.getConnection(function(err,connection){
    connection.query(query,[category_id,2],function(err,result){
      if(err){
        console.log(err);
      }else{
        callback(result);
        connection.release();
      }
    });
  })
};
module.exports = board;
